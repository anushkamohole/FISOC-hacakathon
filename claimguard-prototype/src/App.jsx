import { useState } from 'react';
import UploadPage from './components/UploadPage';
import LoadingPage from './components/LoadingPage';
import ReportCard from './components/ReportCard';
import DetailedBreakdown from './components/DetailedBreakdown';
import Recommendations from './components/Recommendations';
import { analyzePolicyPDF, getMockAnalysis } from './services/geminiService';

function App() {
  const [currentPage, setCurrentPage] = useState('upload'); // upload, loading, report, details, recommendations
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    conditions: [],
    pdfFile: null
  });
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

  // Default mock results (fallback)
  const mockAnalysisResults = {
    vulnerabilityScore: 12,
    totalScenarios: 20,
    scenarios: [
      { id: 1, name: 'Heart Attack', status: 'covered', payout: '₹4.5L', reason: 'Fully covered under cardiac care', clause: 'Section 3.2.1' },
      { id: 2, name: 'Knee Surgery', status: 'rejected', payout: '₹0', reason: '48-month waiting period not met', clause: 'Section 4.7.2(b)', outOfPocket: '₹4.2L' },
      { id: 3, name: 'Cancer Treatment', status: 'partial', payout: '₹3L', reason: 'Sub-limit applies', clause: 'Section 5.1.3', outOfPocket: '₹5L' },
      { id: 4, name: 'Diabetes Management', status: 'rejected', payout: '₹0', reason: 'Pre-existing condition exclusion', clause: 'Section 2.4.1', outOfPocket: '₹80K annually' },
      { id: 5, name: 'Appendicitis Surgery', status: 'covered', payout: '₹1.8L', reason: 'Covered under emergency procedures', clause: 'Section 3.1.2' },
      { id: 6, name: 'Cataract Surgery', status: 'partial', payout: '₹24K', reason: 'Sub-limit on eye procedures', clause: 'Section 5.2.1', outOfPocket: '₹40K' },
      { id: 7, name: 'Dengue Treatment', status: 'covered', payout: '₹60K', reason: 'Vector-borne diseases covered', clause: 'Section 3.3.1' },
      { id: 8, name: 'Hip Replacement', status: 'rejected', payout: '₹0', reason: '48-month waiting period not met', clause: 'Section 4.7.2(a)', outOfPocket: '₹5.5L' },
      { id: 9, name: 'Pneumonia', status: 'covered', payout: '₹1.2L', reason: 'Respiratory illness covered', clause: 'Section 3.3.2' },
      { id: 10, name: 'Robotic Surgery', status: 'rejected', payout: '₹0', reason: 'Robotic procedures excluded', clause: 'Section 6.2.3', outOfPocket: '₹8L' },
      { id: 11, name: 'Bypass Surgery', status: 'covered', payout: '₹5L', reason: 'Cardiac procedures covered', clause: 'Section 3.2.2' },
      { id: 12, name: 'Kidney Stone Removal', status: 'covered', payout: '₹1.5L', reason: 'Urological procedures covered', clause: 'Section 3.4.1' },
      { id: 13, name: 'Thyroid Surgery', status: 'partial', payout: '₹50K', reason: 'ENT sub-limit applies', clause: 'Section 5.3.1', outOfPocket: '₹30K' },
      { id: 14, name: 'Hernia Repair', status: 'covered', payout: '₹80K', reason: 'General surgery covered', clause: 'Section 3.1.3' },
      { id: 15, name: 'Spinal Surgery', status: 'rejected', payout: '₹0', reason: '48-month waiting period not met', clause: 'Section 4.7.2(c)', outOfPocket: '₹6.5L' },
      { id: 16, name: 'Chemotherapy', status: 'partial', payout: '₹3L', reason: 'Cancer treatment sub-limit', clause: 'Section 5.1.4', outOfPocket: '₹4L' },
      { id: 17, name: 'Dialysis', status: 'covered', payout: '₹2.5L annually', reason: 'Renal care covered', clause: 'Section 3.5.1' },
      { id: 18, name: 'Maternity', status: 'rejected', payout: '₹0', reason: 'Maternity not included in base plan', clause: 'Section 6.1.1', outOfPocket: '₹1.5L' },
      { id: 19, name: 'Accident Emergency', status: 'covered', payout: '₹5L', reason: 'Accidental injuries covered', clause: 'Section 3.6.1' },
      { id: 20, name: 'ICU Admission', status: 'partial', payout: '₹1.5L', reason: 'Room rent cap applies', clause: 'Section 5.4.1', outOfPocket: '₹60K' }
    ],
    recommendations: [
      { title: 'Add Super Top-Up for Cancer', cost: '₹8,000/year', benefit: 'Adds ₹10L cancer coverage', urgency: 'high' },
      { title: 'Upgrade to Joint Replacement Rider', cost: '₹6,500/year', benefit: 'Covers knee, hip, spinal surgeries', urgency: 'high' },
      { title: 'Remove Room Rent Cap', cost: '₹4,200/year', benefit: 'Eliminates co-payment on ICU/room charges', urgency: 'medium' }
    ]
  };

  const handleAnalysis = async (formData) => {
    setUserData(formData);
    setCurrentPage('loading');
    setError(null);
    
    try {
      // Check if API key is configured
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('Gemini API key not configured, using mock data');
        // Use mock data
        setTimeout(() => {
          setAnalysisResults(mockAnalysisResults);
          setCurrentPage('report');
        }, 4000);
        return;
      }

      // Real API analysis
      if (formData.pdfFile) {
        const results = await analyzePolicyPDF(formData.pdfFile, formData);
        setAnalysisResults(results);
      } else {
        // No PDF uploaded, use mock
        setAnalysisResults(mockAnalysisResults);
      }
      
      setCurrentPage('report');
    } catch (err) {
      console.error('Analysis failed:', err);
      setError(err.message);
      // Fallback to mock data on error
      setAnalysisResults(mockAnalysisResults);
      setCurrentPage('report');
    }
  };

  const handleScenarioClick = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentPage('details');
  };

  const handleViewRecommendations = () => {
    setCurrentPage('recommendations');
  };

  const handleBackToReport = () => {
    setCurrentPage('report');
  };

  const handleRestart = () => {
    setCurrentPage('upload');
    setUserData({ name: '', age: '', conditions: [], pdfFile: null });
    setSelectedScenario(null);
    setAnalysisResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {currentPage === 'upload' && (
        <UploadPage onAnalysis={handleAnalysis} />
      )}
      {currentPage === 'loading' && (
        <LoadingPage />
      )}
      {currentPage === 'report' && analysisResults && (
        <ReportCard 
          results={analysisResults || mockAnalysisResults} 
          userData={userData}
          onScenarioClick={handleScenarioClick}
          onViewRecommendations={handleViewRecommendations}
          onRestart={handleRestart}
        />
      )}
      {currentPage === 'details' && selectedScenario && (
        <DetailedBreakdown 
          scenario={selectedScenario}
          onBack={handleBackToReport}
        />
      )}
      {currentPage === 'recommendations' && analysisResults && (
        <Recommendations 
          recommendations={analysisResults.recommendations || mockAnalysisResults.recommendations}
          onBack={handleBackToReport}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
