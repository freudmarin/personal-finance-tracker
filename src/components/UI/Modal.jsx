export default function Modal({ children, onClose, className = '' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-200">
      <div className={`bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-lg w-full relative ${className} animate-fade-in`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
      <style>{`.animate-fade-in { animation: fadeIn 0.2s ease; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
