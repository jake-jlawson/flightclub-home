import cv2
import numpy as np
import os
from collections import deque

# module imports
from feed_capture import Feed, Camera, frame_diff_value, frame_diff_values


# SETTINGS
FEED_SETTINGS = {
    "fps": None,
    "analysis_rate": 10,
    "skip_level": 100000,
    "stability_time_horizon": 10,
    "event_threshold": 100,
    "stability_threshold": 10
}


# SETUP CAMERA FEEDS (this will be done dynamically in the app)
fd = Feed([
    Camera(cv2.VideoCapture(2, cv2.CAP_ANY)), 
    Camera(cv2.VideoCapture(3, cv2.CAP_ANY)), 
    Camera(cv2.VideoCapture(4, cv2.CAP_ANY))
], FEED_SETTINGS["fps"])




def main():
    
    #maintain a loop to analyse the live video feed
    frame_count = 0
    prev_frames = fd.capture_frames() #store the initial frames
    running_change_vals = deque(maxlen=FEED_SETTINGS["stability_time_horizon"])
    image_stability_total = 0
    track_event = False
    before_event_frames = []
    after_event_frames = []


    while True:
        
        # skip every nth frame
        if frame_count % FEED_SETTINGS["skip_level"] != 0:
            frame_count += 1
            continue

        print(f"Frame: {frame_count}")
        
        # capture frames from each camera
        new_frames = fd.capture_frames()

        # Display each camera's frame in a single window
        fd.display_feeds(new_frames)



        overall_image_stability = [camera.get_image_instability() for camera in fd.feeds]
        print(overall_image_stability)




        
        
        
        







        frame_count += 1
        prev_frames = new_frames #set previous frames to the new frames

        # Exit the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break



    #decide when a dart has been thrown
    #capture the frame when a dart has been thrown and feed it to the model
    #model will return an output of the score
    #send that to the game app

    #need a way to handle multiple dart throws on the board at once
    #need a way to detect darts being removed from the board
    
    
    # Release all cameras and close windows
    fd.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()