import React from 'react'
import moment from 'moment';
import { Link } from 'react-router'



var getCPULimit = function(pod) {
  var cpuLimit = 'NA';
  if (pod.spec.containers[0].resources && pod.spec.containers[0].resources.limits) {
    cpuLimit = pod.spec.containers[0].resources.limits.cpu
  }
  return cpuLimit;
};


var getMemoryLimit = function(pod) {
  var memLimit = 'NA';
  if (pod.spec.containers[0].resources && pod.spec.containers[0].resources.limits) {
    memLimit = pod.spec.containers[0].resources.limits.memory
  }
  return memLimit;
};


var getStartTime = function(pod) {
  return moment(pod.status.startTime).format("MM/DD HH:mm:ss");
};


var getLastStartTime = function(pod) {
  var startTime = "";
  if (pod.status.containerStatuses && pod.status.containerStatuses[0] && pod.status.containerStatuses[0].state.running) {
    startTime = pod.status.containerStatuses[0].state.running.startedAt;
  }
  return moment(startTime).format("MM/DD HH:mm:ss");
};


var getRestartCount = function(pod) {
  var restartCount = "NA";
  if (pod.status.containerStatuses && pod.status.containerStatuses[0]) {
    restartCount = pod.status.containerStatuses[0].restartCount;
  }
  return restartCount;
};


var getStatus = function(pod) {
  var status = "";
  if (pod.status.containerStatuses && pod.status.containerStatuses[0].state.waiting) {
    status = pod.status.containerStatuses[0].state.waiting.reason;
  }
  return status;
};


var getRestartStyle = function (count) {
  // TODO: Count for uptime
  if (parseInt(count) > 20) {
    return "warning";
  } else {
    return "";
  }
};

var showLabels = function(labels) {
  var labelArray = [];
  for (var key in labels){
    labelArray.push(
      <div className="pod-label" key={key}>
        <Link to={"/pods/label/"+ key +"/" + labels[key]}>{key}: {labels[key]}</Link>
      </div>
    );
  }
  return (
    <div>
      Labels:
      { labelArray }
    </div>
  );
};


export default React.createClass({

  render() {
    var pod = this.props.pod;
    var restartCount = getRestartCount(pod);

    return (
      <div className="name">{pod.metadata.name} - <span className={Object.keys(pod.status.containerStatuses[0].state)[0]}>{Object.keys(pod.status.containerStatuses[0].state)[0]}</span>

      <div className="details">
        Started: {getStartTime(pod)}<br/>
        Last Start: {getLastStartTime(pod)}<br/>
        CPU: {getCPULimit(pod)} Mem: {getMemoryLimit(pod)}<br/>
      </div>
      </div>
    )
  }

});
