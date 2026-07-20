package com.ecosistema.arturo; 
import android.service.quicksettings.Tile; 
import android.service.quicksettings.TileService; 
import android.content.Intent; 
import android.net.Uri; 
import android.widget.Toast; 
public class QuickTileService extends TileService { 
    @Override 
    public void onTileAdded() { 
        super.onTileAdded(); 
        Tile tile = getQsTile(); 
        if (tile != null) { 
            tile.setState(Tile.STATE_INACTIVE); 
            tile.updateTile(); 
        } 
    } 
    @Override 
    public void onClick() { 
        super.onClick(); 
        Tile tile = getQsTile(); 
        if (tile != null) { 
            tile.setState(Tile.STATE_ACTIVE); 
            tile.updateTile(); 
            try { 
                Intent intent = new Intent(Intent.ACTION_VIEW); 
                intent.setData(Uri.parse("http://192.168.1")); 
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); 
                if (android.os.Build.VERSION.SDK_INT  { 
                    startActivityAndCollapse(intent); 
                } 
            } catch (Exception e) { 
                Toast.makeText(getApplicationContext(), "Error de Enlace", Toast.LENGTH_SHORT).show(); 
            } 
            tile.setState(Tile.STATE_INACTIVE); 
            tile.updateTile(); 
        } 
    } 
} 
