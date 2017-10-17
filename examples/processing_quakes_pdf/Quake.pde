class Quake {
    float mag;
    float x;
    float y;
    
    boolean tsu;
    
    private long dateMS;
    
    Quake(float magnitude, long millis){
      tsu = false;
      mag = magnitude;
      x = 0;
      y = 0;
      dateMS = millis/1000;
    }
    
    public double dateMS() {
      return dateMS;
    }
    
    public float getMag(){
      return mag;
    }
    
    public void setCoords(float x_pos, float y_pos){
      x = x_pos;
      y = y_pos;
    }
    
    public void setTsu(boolean caused_tsu){
      tsu = caused_tsu;
    }
    
    public void display() {
      if(mag >= 6.5 || mag < 4.5) {
        noFill();
        stroke(0);
        if(tsu) stroke(0, 102, 255);  // if it caused a tsunami, color it blue
        ellipse(x-Math.round(pow(1.52f,mag*1.5f)), y-Math.round(pow(1.52f,mag*1.5f)), Math.round(pow(1.52f,mag*1.5f)), Math.round(pow(1.52f,mag*1.5f)));
      }
    }
    
    
  }