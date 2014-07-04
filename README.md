aqueducts-ui
============

aqueducts web user interface

## Dependency

* node.js
* ruby
* compass
* yeoman

	npm install -g yo
	npm install -g grunt-cli bower
	gem install compass

## Install

	npm install
	bower install
	grunt serve

## Deploy
*  [aqueducts-ui-deployment.git](http://github.com/ops-baidu/aqueducts-ui-deployment) repo used for hosting generated code

	grunt build
	bash prepare_deploy.sh
