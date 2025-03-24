import '../styles/RightSidebar.scss';

// Human rights content (static data)
const humanRightsContent = [
  {
    id: 'hr1',
    title: 'Freedom of Expression',
    content: 'Everyone has the right to freedom of opinion and expression; this right includes freedom to hold opinions without interference and to seek, receive and impart information and ideas through any media and regardless of frontiers.',
    source: 'Universal Declaration of Human Rights, Article 19'
  },
  {
    id: 'hr2',
    title: 'Right to Equality',
    content: 'All human beings are born free and equal in dignity and rights. They are endowed with reason and conscience and should act towards one another in a spirit of brotherhood.',
    source: 'Universal Declaration of Human Rights, Article 1'
  },
  {
    id: 'hr3',
    title: 'Right to Education',
    content: 'Everyone has the right to education. Education shall be free, at least in the elementary and fundamental stages. Elementary education shall be compulsory.',
    source: 'Universal Declaration of Human Rights, Article 26'
  },
  {
    id: 'hr4',
    title: 'Freedom of Assembly',
    content: 'Everyone has the right to freedom of peaceful assembly and association. No one may be compelled to belong to an association.',
    source: 'Universal Declaration of Human Rights, Article 20'
  }
];

interface RightSidebarProps {
  handleNavigation: (view: string) => void;
}

const RightSidebar = ({ handleNavigation }: RightSidebarProps) => {
  return (
    <aside className="sidebar right-sidebar">
      <div className="sidebar-content">
        <h2>Human Rights</h2>
        <div className="rights-quick-view">
          {humanRightsContent.map((content) => (
            <div key={content.id} className="rights-item">
              <h4>{content.title}</h4>
              <p>{content.content.substring(0, 100)}...</p>
              <button 
                className="view-more-btn"
                onClick={() => handleNavigation('humanrights')}
              >
                View More
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

// Export human rights content to be reused
export { humanRightsContent };