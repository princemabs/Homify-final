import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

function FAQSection() {
  const faqs = [
    {
      question: "How can I book a property on RentHub?",
      answer: "Simply search for your desired destination, select your dates, and choose from our wide range of properties. You can book instantly through our secure payment system.",
    },
    {
      question: "Can I cancel my reservation?",
      answer: "Yes, cancellation policies vary depending on the property. You can check the specific cancellation terms before confirming your booking directly on the property page.",
    },
    {
      question: "Are there any service fees?",
      answer: "RentHub charges a small service fee to help us provide 24/7 customer support and maintain a safe platform for both guests and hosts. This fee is clearly shown before checkout.",
    },
    {
      question: "How do I contact the host?",
      answer: "After booking, you can message the host directly through our in-app chat to discuss any details, check-in times, or special requests.",
    },
  ];

  const [openIndexes, setOpenIndexes] = useState([]);

  const toggleFAQ = (index) => {
    setOpenIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
            </h2>
            <p className="text-gray-500">Everything you need to know about RentHub</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${
                openIndexes.includes(index) 
                ? "border-blue-200 bg-blue-50/30 shadow-sm" 
                : "border-gray-200 hover:border-blue-200 hover:shadow-sm"
              }`}
            >
              <button
                className="flex justify-between items-start w-full text-left p-5 md:p-6 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-bold text-lg pr-4 ${openIndexes.includes(index) ? "text-blue-700" : "text-gray-800"}`}>
                  {faq.question}
                </span>
                <FaChevronDown
                  className={`flex-shrink-0 mt-1 text-gray-400 transition-transform duration-300 ${
                    openIndexes.includes(index) ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndexes.includes(index) ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 pb-6 md:px-6 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
