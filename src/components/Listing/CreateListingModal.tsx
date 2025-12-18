import { 
  X, Home, DoorOpen, Building2, UploadCloud, MapPin, 
  CheckCircle, ChevronLeft, ChevronRight, Loader2, AlertCircle, Trash2 
} from 'lucide-react';
import { useState } from 'react';

interface CreateListingModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const amenitiesList = [
  { id: 1, name: "WiFi" },
  { id: 2, name: "Cuisine" },
  { id: 3, name: "Climatisation" },
  { id: 4, name: "Parking" },
  { id: 5, name: "Piscine" },
  { id: 8, name: "Sécurité" },
];

const steps = [
  "Informations",
  "Détails",
  "Photos",
  "Adresse",
  "Finances"
];

export default function CreateListingModal({ onClose, onSuccess }: CreateListingModalProps) {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); 
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "APARTMENT",
    surface: "",
    number_of_rooms: "",
    number_of_bedrooms: "",
    number_of_bathrooms: "",
    floor: "",
    furnished: false,
    monthly_rent: "",
    charges: "",
    charges_included: false,
    deposit: "",
    agency_fees: "",
    address: {
      street_address: "",
      city: "",
      postal_code: "",
      district: "",
      latitude: "",
      longitude: "",
    },
    amenity_ids: [] as number[],
    status: "PUBLISHED"
  });



  // --- GESTION DES PHOTOS ---

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files) {

      const newFiles = Array.from(e.target.files);

      const validFiles: File[] = [];

      let errorMessage = "";



      newFiles.forEach(file => {

        // Validation : Max 5 Mo

        if (file.size > 5 * 1024 * 1024) {

          errorMessage = `L'image ${file.name} dépasse 5 Mo.`;

        } else {

          validFiles.push(file);

        }

      });



      if (errorMessage) alert(errorMessage);

      

      // Limite à 10 photos max (selon ta spec API)

      if (photos.length + validFiles.length > 10) {

        alert("Vous ne pouvez ajouter que 10 photos maximum.");

        return;

      }



      setPhotos([...photos, ...validFiles]);

    }

  };



  const removePhoto = (index: number) => {

    setPhotos(photos.filter((_, i) => i !== index));

  };



  const toggleAmenity = (id: number) => {

    setFormData((prev) => ({

      ...prev,

      amenity_ids: prev.amenity_ids.includes(id)

        ? prev.amenity_ids.filter((a) => a !== id)

        : [...prev.amenity_ids, id],

    }));

  };



  // --- SOUMISSION ---

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError(null);



    // Validation pré-envoi

    if (photos.length < 3) {

      setError("Veuillez ajouter au moins 3 photos pour publier l'annonce.");

      // On force le retour à l'étape photos si nécessaire

      if (step !== 2) setStep(2);

      return;

    }



    setIsSubmitting(true);

    const token = localStorage.getItem("access_token");



    try {

      // ÉTAPE 1 : CRÉATION DE L'ANNONCE (JSON)

      setUploadStatus("Création de l'annonce...");

      

      const payload = {

        ...formData,

        surface: parseFloat(formData.surface) || 0,

        number_of_rooms: parseInt(formData.number_of_rooms) || 0,

        number_of_bedrooms: parseInt(formData.number_of_bedrooms) || 0,

        number_of_bathrooms: parseInt(formData.number_of_bathrooms) || 0,

        floor: parseInt(formData.floor) || 0,

        address: {

          ...formData.address,

          latitude: parseFloat(formData.address.latitude) || 0,

          longitude: parseFloat(formData.address.longitude) || 0

        }

      };



      const resProp = await fetch("http://localhost:8000/api/properties/", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,

        },

        body: JSON.stringify(payload),

      });



      const propertyData = await resProp.json();



      if (!resProp.ok) {

        console.error(propertyData);

        throw new Error(JSON.stringify(propertyData));

      }



      const propertyId = propertyData.id;



      // ÉTAPE 2 : UPLOAD DES PHOTOS (MULTIPART)

      if (photos.length > 0 && propertyId) {

        setUploadStatus(`Envoi de ${photos.length} photos...`);



        const photoFormData = new FormData();

        // L'API attend la clé "photos" pour une liste de fichiers

        photos.forEach((file) => {

          photoFormData.append("photos", file);

        });



        const resPhotos = await fetch(`http://localhost:8000/api/properties/${propertyId}/upload_photos/`, {

          method: "POST",

          headers: {

            Authorization: `Bearer ${token}`,

            // IMPORTANT : Ne PAS mettre "Content-Type" ici. 

            // Le navigateur le mettra automatiquement en "multipart/form-data" avec le boundary.

          },

          body: photoFormData,

        });



        if (!resPhotos.ok) {

           // Si les photos échouent, on prévient l'utilisateur mais l'annonce est créée

           alert("L'annonce a été créée mais l'envoi des photos a échoué. Vous pourrez les ajouter plus tard.");

        }

      }



      // SUCCÈS TOTAL

      setUploadStatus("Terminé !");

      setTimeout(() => {

        alert("Félicitations ! Votre propriété a été publiée.");

        if (onSuccess) onSuccess();

        onClose();

      }, 500);



    } catch (err: any) {

      console.error("Erreur:", err);

      let msg = "Une erreur est survenue.";

      try {

        // Tentative de parsing d'erreur Django

        const jsonErr = JSON.parse(err.message);

        if (jsonErr.address) msg = "Erreur dans l'adresse (Code postal ou ville manquant).";

        else if (jsonErr.detail) msg = jsonErr.detail;

        else msg = "Vérifiez les champs du formulaire.";

      } catch {

        msg = err.message || "Erreur réseau.";

      }

      setError(msg);

    } finally {

      setIsSubmitting(false);

      setUploadStatus("");

    }

  };



  const progress = ((step + 1) / steps.length) * 100;



  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">

      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">

        

        {/* HEADER */}

        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">

          <div>

            <h2 className="text-2xl font-bold text-gray-800">Ajouter un bien</h2>

            <p className="text-sm text-gray-500">Étape {step + 1}/{steps.length}: {steps[step]}</p>

          </div>

          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">

            <X className="w-5 h-5 text-gray-600" />

          </button>

        </div>



        {/* PROGRESS */}

        <div className="w-full bg-gray-100 h-1.5">

          <div className="bg-blue-600 h-1.5 transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />

        </div>



        {/* ERROR MSG */}

        {error && (

          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in slide-in-from-top-2">

            <AlertCircle className="w-5 h-5 shrink-0" />

            <p className="text-sm font-medium">{error}</p>

          </div>

        )}



        {/* BODY */}

        <div className="flex-1 overflow-y-auto p-8">

          <form id="create-listing-form" onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">

            

            {/* STEP 0: INFOS */}

            {step === 0 && (

              <div className="space-y-6">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>

                  <input

                    type="text" required placeholder="Ex: Appartement T2 Bastos"

                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"

                    value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}

                  />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {[

                    { key: "APARTMENT", icon: Building2, label: "Appartement" },

                    { key: "HOUSE", icon: Home, label: "Maison" },

                    { key: "ROOM", icon: DoorOpen, label: "Chambre" },

                  ].map((item) => {

                    const Icon = item.icon;

                    return (

                      <button type="button" key={item.key} onClick={() => setFormData({ ...formData, type: item.key })}

                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${formData.type === item.key ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"}`}>

                        <Icon size={28} />

                        <span className="font-medium">{item.label}</span>

                      </button>

                    );

                  })}

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>

                  <textarea rows={5} required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"

                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                </div>

              </div>

            )}



            {/* STEP 1: DÉTAILS */}

            {step === 1 && (

              <div className="space-y-6">

                 <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">

                    <input type="checkbox" id="furnished" className="w-5 h-5 text-blue-600 rounded"

                      checked={formData.furnished} onChange={(e) => setFormData({...formData, furnished: e.target.checked})} />

                    <label htmlFor="furnished" className="font-medium text-gray-700">Meublé</label>

                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

                   {/* Inputs numériques simplifiés pour la lisibilité */}

                   {['surface', 'number_of_rooms', 'number_of_bedrooms', 'number_of_bathrooms', 'floor'].map(field => (

                     <div key={field}>

                        <label className="block text-sm font-medium text-gray-600 mb-1 capitalize">{field.replace(/number_of_|s/g, '').replace('_', ' ')}</label>

                        <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-blue-500 outline-none"

                           value={(formData as any)[field]} onChange={e => setFormData({...formData, [field]: e.target.value})} />

                     </div>

                   ))}

                </div>

                <div>

                   <label className="block text-sm font-semibold text-gray-700 mb-3">Équipements</label>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                      {amenitiesList.map(item => (

                        <button key={item.id} type="button" onClick={() => toggleAmenity(item.id)}

                          className={`px-4 py-3 rounded-lg text-sm font-medium text-left transition ${formData.amenity_ids.includes(item.id) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>

                          {item.name}

                        </button>

                      ))}

                   </div>

                </div>

              </div>

            )}



            {/* STEP 2: PHOTOS (CRITIQUE) */}

            {step === 2 && (

              <div className="space-y-6">

                 <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-sm">

                    <p>📸 <strong>Info :</strong> Ajoutez entre <strong>3 et 10 photos</strong>. Max 5 Mo par photo.</p>

                 </div>



                 <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 hover:border-blue-400 transition cursor-pointer relative group">

                    <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"

                      onChange={handlePhotoUpload} />

                    <UploadCloud className="w-10 h-10 text-blue-600 mb-4" />

                    <p className="text-gray-900 font-bold">Glissez vos photos ici</p>

                    <p className="text-sm text-gray-500">ou cliquez pour parcourir</p>

                 </div>



                 {photos.length > 0 && (

                   <div className="grid grid-cols-3 md:grid-cols-4 gap-4">

                      {photos.map((file, idx) => (

                        <div key={idx} className="relative group rounded-xl overflow-hidden shadow-md aspect-square border border-gray-200">

                           <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />

                           <button type="button" onClick={() => removePhoto(idx)}

                              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full transition z-30">

                              <Trash2 size={14} />

                           </button>

                           {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">Principale</span>}

                        </div>

                      ))}

                   </div>

                 )}

                 <p className="text-right text-sm text-gray-500">{photos.length}/10 photos</p>

              </div>

            )}



            {/* STEP 3: ADRESSE */}

            {step === 3 && (

              <div className="space-y-6">

                 <div className="bg-orange-50 p-4 rounded-xl flex gap-3 text-orange-800 text-sm mb-4 border border-orange-100">

                    <MapPin className="shrink-0 w-5 h-5" />

                    <p>Les coordonnées (Lat/Lng) sont obligatoires pour l'affichage sur la carte.</p>

                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">

                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>

                        <input type="text" placeholder="Ex: 123 Avenue..." className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.street_address} onChange={e => setFormData({...formData, address: {...formData.address, street_address: e.target.value}})} />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Code Postal</label>

                        <input type="text" placeholder="Ex: 00237" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.postal_code} onChange={e => setFormData({...formData, address: {...formData.address, postal_code: e.target.value}})} />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>

                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>

                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.district} onChange={e => setFormData({...formData, address: {...formData.address, district: e.target.value}})} />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>

                        <input type="number" step="any" placeholder="3.8..." className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.latitude} onChange={e => setFormData({...formData, address: {...formData.address, latitude: e.target.value}})} />

                    </div>

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>

                        <input type="number" step="any" placeholder="11.5..." className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                           value={formData.address.longitude} onChange={e => setFormData({...formData, address: {...formData.address, longitude: e.target.value}})} />

                    </div>

                 </div>

              </div>

            )}



            {/* STEP 4: FINANCES */}

            {step === 4 && (

              <div className="space-y-8">

                  <div>

                      <label className="block text-lg font-bold text-gray-800 mb-3">Loyer Mensuel</label>

                      <div className="relative">

                          <input type="number" required className="w-full pl-6 pr-20 py-5 rounded-xl border-2 border-gray-300 text-3xl font-bold text-gray-900 focus:border-blue-500 outline-none"

                             value={formData.monthly_rent} onChange={e => setFormData({...formData, monthly_rent: e.target.value})} />

                          <span className="absolute right-6 top-6 text-gray-500 font-bold text-lg">FCFA</span>

                      </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div>

                          <label className="block text-sm font-medium text-gray-600 mb-1">Caution</label>

                          <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                             value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} />

                      </div>

                      <div>

                          <label className="block text-sm font-medium text-gray-600 mb-1">Charges</label>

                          <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                             value={formData.charges} onChange={e => setFormData({...formData, charges: e.target.value})} />

                      </div>

                       <div className="md:col-span-2">

                          <label className="block text-sm font-medium text-gray-600 mb-1">Frais d'agence</label>

                          <input type="number" className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none focus:border-blue-500"

                             value={formData.agency_fees} onChange={e => setFormData({...formData, agency_fees: e.target.value})} />

                      </div>

                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">

                    <input type="checkbox" id="charges_included" className="w-5 h-5 text-blue-600 rounded"

                      checked={formData.charges_included} onChange={(e) => setFormData({...formData, charges_included: e.target.checked})} />

                    <label htmlFor="charges_included" className="font-medium text-gray-700">Charges incluses ?</label>

                 </div>

              </div>

            )}

          </form>

        </div>



        {/* FOOTER */}

        <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-between items-center z-10">

            {step > 0 ? (

               <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition flex items-center gap-2">

                 <ChevronLeft size={20} /> Retour

               </button>

            ) : <div />}

            {step < steps.length - 1 ? (

               <button type="button" onClick={() => setStep(step + 1)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition">

                 Suivant <ChevronRight size={20} />

               </button>

            ) : (

               <button type="submit" form="create-listing-form" disabled={isSubmitting} className="bg-blue-600 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-70">

                 {isSubmitting ? (

                    <>

                        <Loader2 className="animate-spin" /> {uploadStatus || "Envoi..."}

                    </>

                 ) : (

                    <> <CheckCircle /> Publier </>

                 )}

               </button>

            )}

        </div>

      </div>

    </div>

  );

}