import React from 'react';
import { Award, Users, Leaf, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D4A3E]/10 to-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-['Lato'] text-5xl font-bold text-[#2D4A3E] mb-6">
            About Fungal Flux
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            We're passionate about making mycology accessible to everyone, from curious beginners 
            to experienced cultivators. Our mission is to provide the highest quality mushroom 
            cultivation supplies with expert guidance every step of the way.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['Lato'] text-3xl font-semibold text-[#2D4A3E] mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded in 2020 by a team of mycology enthusiasts, Fungal Flux began as a small 
                laboratory dedicated to producing the highest quality mushroom cultures. What started 
                as a passion project has grown into a trusted source for mushroom cultivation supplies 
                across the country.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We believe that growing your own mushrooms should be accessible, rewarding, and 
                successful. That's why we've developed comprehensive kits, detailed guides, and 
                provide ongoing support to help every grower succeed.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Mushroom cultivation" 
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Lato'] text-3xl font-semibold text-[#2D4A3E] text-center mb-12">
            Our Values
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Quality First
              </h3>
              <p className="text-gray-600">
                Every product is rigorously tested to ensure the highest standards of purity and viability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Community
              </h3>
              <p className="text-gray-600">
                We're building a supportive community of growers who share knowledge and celebrate success.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Sustainability
              </h3>
              <p className="text-gray-600">
                We're committed to sustainable practices and helping people grow their own food at home.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#2D4A3E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-white" size={28} />
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-3">
                Passion
              </h3>
              <p className="text-gray-600">
                Our love for mycology drives everything we do, from product development to customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-['Lato'] text-3xl font-semibold text-[#2D4A3E] text-center mb-12">
            Meet Our Team
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">👨‍🔬</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-2">
                Dr. Sarah Chen
              </h3>
              <p className="text-gray-600 mb-3">Lead Mycologist</p>
              <p className="text-sm text-gray-500">
                PhD in Mycology with 15 years of experience in mushroom cultivation and research.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-2">
                Mike Rodriguez
              </h3>
              <p className="text-gray-600 mb-3">Operations Manager</p>
              <p className="text-sm text-gray-500">
                Ensures every order meets our quality standards and reaches customers quickly.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-4xl">👩‍🎓</span>
              </div>
              <h3 className="font-['Lato'] text-xl font-semibold text-[#2D4A3E] mb-2">
                Emma Thompson
              </h3>
              <p className="text-gray-600 mb-3">Customer Success</p>
              <p className="text-sm text-gray-500">
                Helps customers succeed with expert guidance and troubleshooting support.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}