RegisterServerEvent("boombox:getup", function(hash)
    if hash ~= `prop_boombox_01` then return end
    exports.ox_inventory:AddItem(source, 'boombox', 1)
end)

RegisterServerEvent("boombox:play", function(link, boombox, coords)
    if boombox then
        exports.xsound:PlayUrlPos(-1, "boombox", link, 0.5, coords, true)
    end
end)

RegisterServerEvent("boombox:resum", function(boombox)
    if boombox then
        exports.xsound:Resume(-1, "boombox")
    end
end)

RegisterServerEvent("boombox:pause", function(boombox)
    if boombox then
        exports.xsound:Pause(-1, "boombox")
    end
end)

RegisterServerEvent("boombox:stop", function(boombox)
    if boombox then
        exports.xsound:Destroy(-1, "boombox")
    end
end)

RegisterServerEvent("boombox:volume", function(boombox, hang)
    if boombox then
        exports.xsound:setVolume(-1, "boombox", hang)
    end
end)

RegisterServerEvent("boombox:remove", function()
    exports.ox_inventory:RemoveItem(source, 'boombox', 1)
end)

AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        exports.xsound:Destroy(-1, "boombox")
    end
end)