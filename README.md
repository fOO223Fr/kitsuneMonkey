##################################
######## Kitsune Monkey ##########
##################################

Our project is organized into 3 separate sections, the most important
being the kubeMonkeyDeployment folder, which contains the deployment for
kube-monkey and an nginx app.

#######Prerequisites##############

1) Working Kubernetes cluster
2) Docker Images:
	2.1) nginx
	2.2) Tomcat
	2.3) kube-monkey
	2.4) cadvisor
	2.5) prometheus

#Things To Note *BEFORE* Deployment#

1) All docker images in our Kubernetes yaml files are tagged as vip-intOAM:5001, they need to be replaced or tagged in a similar manner, where applicable in all the yaml files.
2) Wherever applicable in all the yaml files, the "nodeAffinity" section should have the same node name as the local kubernetes cluster which can be found under "values", in our case it can be seen as "jedha-admin-1". See example here: 
	https://github.com/fOO223Fr/kitsuneMonkey/blob/master/kubeMonkeyDeployment/nginxDeploy.yml#L65
3) The default settings for our kube-monkey deployment are in debug mode; this causes "monkey-man" nginx deployment pods to constantly be taken down by kube-monkey every 10 seconds. However, our demo webpage accessible at 
<node-ip>:31500 see config.toml specified here:
	https://github.com/fOO223Fr/kitsuneMonkey/blob/master/kubeMonkeyDeployment/kubeMonkeyDeploy.yml#L8
4) Kubernetes api needs to be accessible from the outside, so that the front end dashboarding can be functional. This is achieved by the following command:
	`kubectl proxy --address=0.0.0.0 -p 8080 --accept-hosts='^*$'`
5) Fix the nginxDeploy.yml file, by explicitly stating the absolute path. see line number to change here: 
https://github.com/fOO223Fr/kitsuneMonkey/blob/master/kubeMonkeyDeployment/nginxDeploy.yml#L82 

as well as

https://github.com/fOO223Fr/kitsuneMonkey/blob/master/kubeMonkeyDeployment/nginxDeploy.yml#L85


#############Deployment############

1) `git clone git@github.com:fOO223Fr/kitsuneMonkey.git`
2) `cd kitsuneMonkey/kubeMonkeyDeployment`
3) `kubectl apply -f .` #at this point kube-monkey is already working and deleting pods starting with monkey-man
4) `cd ..` 
5) `cd customApp/`
6) `kubectl apply -f .`
7) `kubectl proxy --address=0.0.0.0 -p 8080 --accept-hosts='^*$'`
8) `cd ../frontend/`
9) At this point the backend is running fine and for the frontend, follow the README here:
  https://github.com/fOO223Fr/kitsuneMonkey/tree/master/frontend
