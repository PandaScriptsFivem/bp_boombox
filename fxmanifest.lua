fx_version 'cerulean' 
game 'gta5' 
lua54 "yes"
server_scripts {
    'server.lua' 
}

client_scripts {
    'client.lua',
    "@ox_lib/init.lua"
}

ui_page 'ui/index.html'

files {
    'ui/*.*',
}

dependencies {
    'ox_inventory', 
    'ox_target',    
    'xsound'        
}

author 'BP Scripts'
description 'tudol Zenét halgatni?'
version '0.9.0' 