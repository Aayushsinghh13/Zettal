const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-20">
    <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin"
      style={{ border: '3px solid rgba(245,158,11,0.2)', borderTopColor: '#F59E0B' }} />
    <p className="text-sm text-slate-500">{message}</p>
  </div>
);

export default LoadingSpinner;
