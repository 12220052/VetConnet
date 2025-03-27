import React, { useState } from "react";

const ContentManagement = () => {
  const [diseaseOutbreaks, setDiseaseOutbreaks] = useState([]);
  const [banners, setBanners] = useState([]);
  const [faqs, setFaqs] = useState([]);

  const addDiseaseOutbreak = () => {
    setDiseaseOutbreaks([...diseaseOutbreaks, { image: "", description: "" }]);
  };

  const addBanner = () => {
    setBanners([...banners, { image: "", title: "" }]);
  };

  const addFaq = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Content Management</h1>

      {/* Disease Outbreak Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Disease Outbreak</h2>
        <button onClick={addDiseaseOutbreak} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Add Disease Outbreak
        </button>
        {diseaseOutbreaks.map((item, index) => (
          <div key={index} className="border p-4 mt-4 rounded-lg shadow">
            <div className="relative mb-2">
              <i className="fas fa-upload absolute left-2 top-3 text-gray-500"></i>
              <input type="file" className="border p-2 w-full pl-8" />
            </div>
            <textarea className="border p-2 w-full mt-2" placeholder="Enter description..." />
          </div>
        ))}
      </section>

      {/* Banner Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Banner</h2>
        <button onClick={addBanner} className="mt-2 px-4 py-2 bg-green-500 text-white rounded">
          Add Banner
        </button>
        {banners.map((item, index) => (
          <div key={index} className="border p-4 mt-4 rounded-lg shadow">
            <div className="relative mb-2">
              <i className="fas fa-upload absolute left-2 top-3 text-gray-500"></i>
              <input type="file" className="border p-2 w-full pl-8" />
            </div>
            <input type="text" className="border p-2 w-full mt-2" placeholder="Enter banner title..." />
          </div>
        ))}
      </section>

      {/* FAQ Section */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <button onClick={addFaq} className="mt-2 px-4 py-2 bg-purple-500 text-white rounded">
          Add FAQ
        </button>
        {faqs.map((item, index) => (
          <div key={index} className="border p-4 mt-4 rounded-lg shadow">
            <input type="text" className="border p-2 w-full" placeholder="Enter question..." />
            <textarea className="border p-2 w-full mt-2" placeholder="Enter answer..." />
            <div className="mt-2 flex items-center">
              <label className="mr-2">Active:</label>
              <input type="checkbox" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ContentManagement;
