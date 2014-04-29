require "capistrano"

set :application, "aqueducts-ui"
set :user, "work"
set :deploy_to, "/home/#{user}/local/#{application}/"
set :use_sudo, false

set :scm, :none
set :repository,  "/home/#{user}/ci/jenkins/workspace/aqueducts-deploy_ui"
set :deploy_via, :copy
set :copy_compression, :gzip
set :keep_releases, 5

set :local_dir, "/home/#{user}/local"
set :current_path, "#{local_dir}/#{application}/current"

role :ui, "example"

namespace :deploy do

  task :prepare, :role => :host do
    run "mkdir -p #{local_dir}/#{application}/releases"
  end

  task :link, :role => :host do
    run "unlink #{local_dir}/nginx/conf/conf.d/#{application}.conf 2>/dev/null; ln -s #{current_path}/config/nginx.conf #{local_dir}/nginx/conf/conf.d/#{application}.conf"
  end

end

before "deploy", "deploy:prepare"
after "deploy", "deploy:link"
