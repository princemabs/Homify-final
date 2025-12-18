function PropertyTypeSection() {
	const properties = [
		{
			name: "Apartments",
			image:
				"https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=80",
		},
		{
			name: "Homes",
			image:
				"https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
		},
		{
			name: "Hotels",
			image:
				"https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
		},
		{
			name: "Cabins",
			image:
				"https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
		},
	];

	return (
		<section className="bg-white py-12 px-8">
			<p className="text-3xl font-bold text-center mb-8">
				<span className="text-zinc-950">Browse by Property Type</span>
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
				{properties.map((p, index) => (
					<div
						key={index}
						className="relative overflow-hidden rounded-xl shadow hover:shadow-lg transition"
					>
						<div className="relative">
							<img
								src={p.image}
								alt={p.name}
								className="w-full h-56 object-cover brightness-50"
							/>
														
							<span className="absolute bottom-3 left-2 bg-transparent text-gray-50 text-lg font-bold px-3 py-1 ">
								{p.name}
							</span>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default PropertyTypeSection;
