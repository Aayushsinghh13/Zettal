// Props:
//   icon     - React node (icon component)
//   title    - heading text
//   message  - description text
//   action   - optional { label, onClick } for a CTA button
const EmptyState = ({ icon, title, message, action }) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
    {icon && <div className="text-primary-300 text-6xl">{icon}</div>}
    <h3 className="text-xl font-semibold text-slate-700">{title}</h3>
    <p className="text-slate-500 max-w-sm">{message}</p>
    {action && (
      <button onClick={action.onClick} className="btn-primary mt-2">
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
