import React from 'react';
const SideNavigation = () => <React.Fragment><Navigation /></React.Fragment>;

class Navigation extends React.Component {
  constructor(){
    super();
    this.state = {
      isActive: false,
    }
  }
  
  handleToggle = () => {
    const { isActive } = this.state;
    this.setState({ isActive: !isActive });
  }
  
  handleSelect = () => {
    this.setState({ isActive: false });
  }

  render() {
    const { isActive } = this.state;
    const iconCls = `navigation__icon ${isActive ? 'transformed' : ''}`;
    const navCls = isActive ? 'navigation--active' : '';
    return(
      <div className='navigation'>
        <div className='navigation__toggle' onClick={this.handleToggle}>
          <div className={iconCls}>
            <span></span>
          </div>
        </div>
        <nav className={navCls}>
          <div className='navigation__brand'>Jump to</div>
          <ul>
            <li><a href="#" onClick={this.handleSelect}>home</a></li>
            <li><a href="#" onClick={this.handleSelect}>First</a></li>
            <li><a href="#" onClick={this.handleSelect}>Second</a></li>
            <li><a href="#" onClick={this.handleSelect}>contact</a></li>
          </ul>
        
        </nav>
      </div>
    );
  }
}
export default SideNavigation;
