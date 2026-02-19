import { useState } from 'react';
import { Upload, User, Calendar, FileText } from 'lucide-react';

function UploadPage({ onAnalysis }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    conditions: [],
    pdfFile: null
  });
  const [fileName, setFileName] = useState('');

  const commonConditions = ['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Arthritis'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setFormData(prev => ({ ...prev, pdfFile: file }));
    }
  };

  const handleConditionToggle = (condition) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.age) {
      onAnalysis(formData);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block p-3 bg-cyan-500 rounded-xl mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">ClaimGuard</h1>
        <p className="text-lg text-gray-600">AI-Powered Insurance Stress Testing</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
        {/* Policy Upload */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Upload Your Policy Document
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-cyan-400 transition-colors cursor-pointer">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload}
              className="hidden"
              id="fileUpload"
            />
            <label htmlFor="fileUpload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              {fileName ? (
                <p className="text-cyan-600 font-medium">{fileName}</p>
              ) : (
                <>
                  <p className="text-gray-600 font-medium mb-1">Click to upload policy PDF</p>
                  <p className="text-sm text-gray-400">or drag and drop</p>
                </>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {formData.pdfFile ? 'PDF ready for analysis' : 'Upload a policy PDF or skip to use demo data'}
          </p>
        </div>

        {/* Personal Details */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-2" />
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="Enter your age"
              min="18"
              max="100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Pre-existing Conditions (Optional)
            </label>
            <div className="flex flex-wrap gap-2">
              {commonConditions.map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => handleConditionToggle(condition)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.conditions.includes(condition)
                      ? 'bg-cyan-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Analyze My Policy
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Analysis takes ~30 seconds • Your data is secure
        </p>
      </form>

      {/* Trust Indicators */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-cyan-600">50+</p>
          <p className="text-sm text-gray-600">Policies Analyzed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-cyan-600">90%</p>
          <p className="text-sm text-gray-600">Found Hidden Clauses</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-cyan-600">₹1.8L</p>
          <p className="text-sm text-gray-600">Avg. Rejection Prevented</p>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
