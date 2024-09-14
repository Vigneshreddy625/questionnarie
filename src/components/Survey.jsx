import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const questions = [
  { id: 1, text: "How satisfied are you with our products?", type: "rating", min: 1, max: 5 },
  { id: 2, text: "How fair are the prices compared to similar retailers?", type: "rating", min: 1, max: 5 },
  { id: 3, text: "How satisfied are you with the value for money of your purchase?", type: "rating", min: 1, max: 5 },
  { id: 4, text: "On a scale of 1-10 how would you recommend us to your friends and family?", type: "rating", min: 1, max: 10 },
  { id: 5, text: "What could we do to improve our service?", type: "text" },
];

const CustomerSurvey = () => {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [storedData, setStoredData] = useState(null);
  const [countDown, setcountDown] = useState(5);

  useEffect(() => {
    if(countDown === 0) return;

    const timer = setInterval(() => {
        setcountDown(prev => prev - 1);
    }, 1000)

    return () => clearInterval(timer);
  }, [countDown])
  

  useEffect(() => {
    if (currentScreen === 'welcome') {
      const newSessionId = Date.now();
      setSessionId(newSessionId);
      setAnswers({});
      setCurrentQuestionIndex(0);
      console.log('New session started:', newSessionId);
    }
  }, [currentScreen]);

  const handleStart = () => setCurrentScreen('survey');

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowConfirmation(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const dataToStore = { answers, status: 'COMPLETED' };
    localStorage.setItem(sessionId.toString(), JSON.stringify(dataToStore));
    console.log('Data stored in localStorage:', dataToStore);
    setShowConfirmation(false);
    setCurrentScreen('thank-you');
    setcountDown(5);
  };

  const handleThankYouTimeout = () => {
    setTimeout(() => setCurrentScreen('welcome'), 5000);
  };

  const checkStoredData = () => {
    const allData = Object.entries(localStorage).map(([key, value]) => ({
      sessionId: key,
      data: JSON.parse(value)
    }));
    setStoredData(allData);
    console.log('All stored data:', allData);
  };

  const renderWelcomeScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white p-4 sm:p-8">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6 text-center">Welcome to our Customer Survey</h1>
        <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-center">We value your feedback! Help us improve our services.</p>
        <div className="flex flex-col space-y-4">
          <button 
            className="bg-white text-purple-600 font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            onClick={handleStart}
          >
            Start Survey
          </button>
          <button 
            className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            onClick={checkStoredData}
          >
            Check Stored Data
          </button>
        </div>
      </div>
      {storedData && (
        <div className="mt-8 p-4 sm:p-6 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Stored Data:</h2>
          <div className="overflow-auto max-h-64">
            <pre className="whitespace-pre-wrap text-xs sm:text-sm">
              {JSON.stringify(storedData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  const renderSurveyScreen = () => {
    const question = questions[currentQuestionIndex];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white p-4 sm:p-8">
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl max-w-md w-full">
          <div className="mb-6">
            <div className="w-full bg-blue-200 rounded-full h-2.5 mb-4">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}></div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">{`Question ${currentQuestionIndex + 1} of ${questions.length}`}</h2>
          </div>
          <p className="text-lg sm:text-xl mb-6">{question.text}</p>
          {question.type === 'rating' ? (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                {[...Array(question.max - question.min + 1)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index + question.min)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      answers[question.id] === index + question.min
                        ? 'bg-yellow-400 text-indigo-900'
                        : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                    }`}
                  >
                    {index + question.min}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span>Not at all likely</span>
                <span>Extremely likely</span>
              </div>
            </div>
          ) : (
            <textarea
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full h-32 p-3 border rounded-lg bg-white bg-opacity-20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 mb-6"
              placeholder="Type your answer here..."
            />
          )}
          <div className="flex justify-between">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestionIndex === 0}
              className="flex items-center justify-center bg-transparent border-2 border-white text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="mr-2" size={20} />
              Previous
            </button>
            <button 
              onClick={handleNext}
              className="flex items-center justify-center bg-white text-indigo-600 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
              <ArrowRight className="ml-2" size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmationDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-indigo-900">Are you sure?</h2>
        <p className="mb-6 text-gray-600">This will submit your survey responses. You won't be able to change them after submission.</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => setShowConfirmation(false)}
            className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  const renderThankYouScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 text-white p-4 sm:p-8">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl p-6 sm:p-8 shadow-2xl text-center max-w-md w-full">
        <div className="mb-6">
          <Check size={80} className="mx-auto text-green-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Thank You!</h1>
        <p className="text-lg sm:text-xl mb-6">We truly appreciate your feedback. It helps us improve our services for you!</p>
        <p className="text-base sm:text-lg">Redirecting to home in {countDown} seconds...</p>
      </div>
    </div>
  );

  useEffect(() => {
    if (currentScreen === 'thank-you') {
      handleThankYouTimeout();
    }
  }, [currentScreen]);

  return (
    <div className="min-h-screen">
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'survey' && renderSurveyScreen()}
      {currentScreen === 'thank-you' && renderThankYouScreen()}
      {showConfirmation && renderConfirmationDialog()}
    </div>
  );
};

export default CustomerSurvey;