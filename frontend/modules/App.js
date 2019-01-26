import React from 'react'
import NavLink from './NavLink'
import { Link } from 'react-router'

export default React.createClass({
  getInitialState: function() {
    return {
      username: '',
      namespace: "monkey"
    }
  },

  render() {
    return (
      <div>
        <header><span className="logo"></span> </header>
        <div className="content-wrapper">
            {this.props.children}
        </div>
      </div>
    )
  }
})


// <div className="main-sidebar">
//   <section className="sidebar">
//     <ul role="nav" className="sidebar-menu">
//       <li><NavLink to="/events">Events</NavLink></li>
//       <li><NavLink to="/nodes">Nodes</NavLink></li>
//       <li><NavLink to="/pods">Pods</NavLink></li>
//     </ul>
//   </section>
// </div>