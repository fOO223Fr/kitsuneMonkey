import React from 'react'
import axios from 'axios';
import { Link } from 'react-router'
import moment from 'moment';
import Loader from './Loader'


var timer;


var _axios = axios.create({
  baseURL: 'http://172.28.252.22:8080',
});

var getClassFromType = function(type) {
  var className = '';
  if (type == 'Warning') {
    className = 'danger';
  }
  return className;
};


var displayInvolvedObject = function(involvedObject) {
  var html;
  if (involvedObject.kind == 'Pod') {
    html = <Link to={"/namespaces/"+ involvedObject.namespace +"/pods/"+ involvedObject.name}>Pod {involvedObject.name}</Link>;
  } else {
    html = involvedObject.kind + ' ' + involvedObject.name;
  }
  return html;
};


class WarningCount extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var total = this.props.count;
    var message = total + (total > 1 ? ' warnings' : ' warning');
    return (<span>{ message }</span>)
  }

}


export default React.createClass({
  getInitialState: function() {
    return {
      isLoading: false,
      events: [],
      namespace: '',
      warningCount: 0
    }
  },


  componentWillReceiveProps: function (nextProps) {
    // Only load if params have changed
    if (nextProps.params.namespace != this.props.params.namespace) {
      clearInterval(timer);
      var namespace = nextProps.params.namespace;
      this.setState({namespace: namespace});
      this.loadDocument(namespace);
      var refreshValue = this.state.refreshValue;
      if (refreshValue != undefined && refreshValue != '0') {
        const refreshInterval = parseInt(refreshValue) * 1000;
        this.startRefresh(refreshInterval, namespace);
      }
    }
  },


  componentWillUnmount: function() {
    if (timer) {
      clearInterval(timer);
    }
  },


  startRefresh: function(refreshInterval, namespace) {
    var loadDocument = this.loadDocument;
    timer = setInterval(function(x) {
      loadDocument(x);
    }, refreshInterval, namespace);
  },


  handleRefreshChange: function(event) {
    const refreshValue = event.target.value;
    this.setState({refreshValue: refreshValue});
    if (refreshValue == "0") {
      clearInterval(timer);
    } else {
      const refreshInterval = parseInt(refreshValue) * 1000;
      var namespace = this.state.namespace;
      this.startRefresh(refreshInterval, namespace);
    }
  },


  loadDocument: function(namespace) {
    this.setState({ isLoading: true });

    var url = '/api/v1/events';
    var title = 'Events';

    if (namespace) {
      url = '/api/v1/namespaces/' + namespace + '/events';
      title = 'Events for ' + namespace;
    }

    this.setState({ title: title });

    _axios.get(url)
      .then(res => {
        var events = [];
        var warningCount = 0;
        if (res.data.items) {
          // Sort descending
          events = res.data.items.sort(function(a, b) {
            return b.lastTimestamp.localeCompare(a.lastTimestamp);}
            );
          const eventsLength = events.length;
          for (var i = 0; i < eventsLength; i++) {
            if (events[i].type === 'Warning') {
              warningCount += 1;
            }
          }
        }
        this.setState({ isLoading: false, events: events, warningCount: warningCount });
      });
  },


  componentDidMount: function() {
    var namespace = this.props.params.namespace;
    this.setState({namespace: namespace});
    this.loadDocument(namespace);
  },

  render: function() {
    return (
      <div className="scrollable">
        <h1>{this.state.title} ({this.state.events.length})</h1>
        <form>
          <label>Refresh Interval:</label>
          <select name="refreshInterval" onChange={this.handleRefreshChange}>
            <option value="0">No Refresh</option>
            <option value="10">10 seconds</option>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="600">10 minutes</option>
          </select>
        </form>
        <b>Last Hour: (<WarningCount count={this.state.warningCount}/>)</b>

        <Loader isLoading={this.state.isLoading} />
        <table className="table table-striped table-bordered table-hover table-condensed">
          <thead>
          <tr>
            <th>NS</th>
            <th>Name</th>
            <th>Reason</th>
            <th>Message</th>
            <th>Count</th>
            <th>Last Time</th>
            <th>Type</th>
          </tr>
          </thead>
          <tbody>
          {this.state.events.map(event =>
            <tr key={event.metadata.uid} className={getClassFromType(event.type)}>
              <td><Link to={"/namespaces/"+ event.metadata.namespace +"/events"}>{event.metadata.namespace}</Link></td>
              <td>{displayInvolvedObject(event.involvedObject)}</td>
              <td>{event.reason}</td>
              <td>{event.message}</td>
              <td>{event.count}</td>
              <td>{moment(event.lastTimestamp).format("HH:mm:ss.sss")}</td>
              <td>{event.type}</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    )
  }

})
