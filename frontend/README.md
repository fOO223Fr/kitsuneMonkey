# Kubernetes Custom Dashboard

Run locally with html and javascript.  Connect to your cluster simply using kubectl proxy.

![Screenshot](screenshot.jpg)

View:
* Namespaces
* Events
* Pods running on Nodes
* Pods by Namespace or Label
* Node CPU and Memory

This project will create the necessary html and javascript files
to run the dashboard on your local machine.
The kubectl proxy command will start an internal server using the static dashboard files.

Clone this repo:
```
git clone https://github.com/jdeskins/k8s-custom-dashboard.git
cd k8s-custom-dashboard
```

Build the javascript files.
```
npm install
npm run build
```

Create the proxy to Kubernetes API.
```
kubectl proxy --www=.
```

Open browser to <http://localhost:8001/static/> to see the custom dashboard.
The default port is 8001.

A helper script is also available.  To start the proxy from the script, run:
```
./proxy.sh
```

## Proxy Kubernetes API Server
Running the kubectl proxy command will run a proxy to the Kubernetes API server using
the credentials in **~/.kube/config** file.

To use other credentials, set the Environment variable pointing to the credentials yaml file.
```
export KUBECONFIG=/path-to-config/kube.yaml
```

Now when running `kubectl` commands, it will use the credentials in the file provided in Environment variable.
