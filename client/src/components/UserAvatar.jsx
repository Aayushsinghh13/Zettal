import { getInitials } from '../utils/formatDate';

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
};

const UserAvatar = ({ name = '', avatar = '', size = 'md', online = false }) => {
  return (
    <div className="relative flex-shrink-0">
      {avatar ? (
        <img src={avatar} alt={name}
          className={`${sizeMap[size]} rounded-full object-cover`}
          style={{ boxShadow: '0 0 0 2px rgba(245,158,11,0.3)' }} />
      ) : (
        <div className={`${sizeMap[size]} rounded-full flex items-center justify-center font-bold text-navy-900`}
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FCD34D)', boxShadow: '0 0 0 2px rgba(245,158,11,0.2)' }}>
          {getInitials(name)}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2"
          style={{ borderColor: '#040D14' }} />
      )}
    </div>
  );
};

export default UserAvatar;
