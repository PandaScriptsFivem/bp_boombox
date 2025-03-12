local placedBoombox = nil

exports('useItem', function()
    local playerPed = PlayerPedId()
    RequestAnimDict('amb@medic@standing@kneel@base')
    while not HasAnimDictLoaded('amb@medic@standing@kneel@base') do
        Wait(10)
    end
    TaskPlayAnim(playerPed, 'amb@medic@standing@kneel@base', 'base', 8.0, -8.0, -1, 1, 0, false, false, false)

    if lib.progressBar({
        duration = 2500,
        label = 'Boombox elhelyezése...',
        useWhileDead = false,
        canCancel = true,
        disable = {
            move = true,
            car = true,
            combat = true,
            mouse = false
        },
        anim = {
            scenario = 'PROP_HUMAN_BUM_BIN',
        },
    }) then
        PlaceBoombox() 
    else
    end

    ClearPedTasks(playerPed)
end)

function PlaceBoombox()
    local playerPed = PlayerPedId()
    local playerCoords = GetEntityCoords(playerPed)
    local playerHeading = GetEntityHeading(playerPed)
    local modelHash = GetHashKey('prop_boombox_01')
    
    RequestModel(modelHash)

    while not HasModelLoaded(modelHash) do
        Wait(10)
    end

    local offset = GetOffsetFromEntityInWorldCoords(playerPed, 0.0, 1.0, -1.0) 
    placedBoombox = CreateObject(modelHash, offset.x, offset.y, offset.z, true, true, true)
    
    SetEntityHeading(placedBoombox, playerHeading) 
    PlaceObjectOnGroundProperly(placedBoombox)
    FreezeEntityPosition(placedBoombox, true) 
    
    TriggerServerEvent("boombox:remove")
    
    exports.ox_target:addLocalEntity(placedBoombox, {
        {
            name = 'open_boombox',
            icon = 'fa-solid fa-music',
            label = 'Boombox megnyitása',
            onSelect = function()
                SetNuiFocus(true, true)
                SendNUIMessage({
                    type = 'open'
                })
            end
        },
        {
            name = 'get_boombox',
            icon = 'fa-solid fa-music',
            label = 'Boombox felvétele',
            onSelect = function()
                TriggerServerEvent("boombox:getup", modelHash)
                print(modelHash)
                DeleteBoombox()
            end
        }
    })
end

function ShowNotification(message)
    BeginTextCommandThefeedPost('STRING')
    AddTextComponentSubstringPlayerName(message)
    EndTextCommandThefeedPostTicker(false, true)
end

RegisterNUICallback('close_boombox', function(data, cb)
    SetNuiFocus(false, false)
    cb('ok')
end)

RegisterNUICallback('playsound', function(data, cb)
    TriggerServerEvent("boombox:play", data.link, placedBoombox, GetEntityCoords(placedBoombox))
    cb('ok')
end)

function DeleteBoombox()
    if placedBoombox then
        TriggerServerEvent("boombox:pause", placedBoombox)
        DeleteEntity(placedBoombox) 
        placedBoombox = nil
        ShowNotification('Boombox eltávolítva!')
    end
end

RegisterCommand('remove_boombox', function()
    DeleteBoombox()
end)

RegisterNUICallback('play', function(_, cb)
    TriggerServerEvent("boombox:resum", placedBoombox)
    cb('ok')
end)

RegisterNUICallback('pause', function(_, cb)
    TriggerServerEvent("boombox:pause", placedBoombox)
    cb('ok')
end)

RegisterNUICallback('stop', function(_, cb)
    TriggerServerEvent("boombox:stop", placedBoombox)
    cb('ok')
end)

RegisterNUICallback('volume', function(data, cb)
    if data.volume then
        TriggerServerEvent("boombox:volume", placedBoombox, data.volume)
    end
    cb('ok')
end)

AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        DeleteBoombox()
    end
end)