"""
    FEED_CAPTURE.PY
    ~~~~~~
    This module provides classes for capturing and processing video feeds from cameras,
    as well as combining multiple feeds into a single feed for analysis.
"""
# IMPORTS
import cv2
import numpy as np
from typing import List, Tuple
from collections import deque

# PARAMETERS
STABILITY_SETTINGS = {
    "time_horizon": 10,
    "change_threshold": 100
}


# CLASS: Camera
# Provides a class for capturing and processing video feeds from a camera.
class Camera:
    def __init__(self, stream: cv2.VideoCapture):
        
        # Setup OpenCV Camera Stream
        self.stream = stream
        if not self.stream.isOpened():
            print(f"Error opening camera feed {self.stream}")

        # Track camera frame information
        self.prev_frame = self.stream.read()[1]
        self.current_frame = self.prev_frame

        # Image stability tracking
        self.instability_vals = deque(maxlen=STABILITY_SETTINGS["time_horizon"]) #track last n stability values
        self.image_instability_total = 0 #track sum


    """
    @method update | Update camera attributes to track changes between frames.
    """
    def update(self):
        self.prev_frame = self.current_frame
        self.current_frame = self.capture()

        return self.current_frame


    """
    @method capture | Capture a frame from the camera stream and return it as a numpy array.
    """
    def capture(self) -> np.ndarray:
        
        ret, frame = self.stream.read()

        if not ret:
            print("Error: Frame could not be captured.")
            return None

        return frame
    

    """
    @method get_image_instability | Get a value representing the image instability of the camera.
    """
    def get_image_instability(self) -> int:
        diff_value = get_frame_diff(self.prev_frame, self.current_frame, STABILITY_SETTINGS["change_threshold"])

        #remove the oldest instability value if the deque is full
        if len(self.instability_vals) == STABILITY_SETTINGS["time_horizon"]: 
            self.image_instability_total -= self.instability_vals[0]

        #add the new instability value to the deque
        self.instability_vals.append(diff_value)

        #update the total instability
        self.image_instability_total += diff_value

        return self.image_instability_total / len(self.instability_vals) #moving average of the instability values
    


# CLASS: Feed
# Provides a class for analysing a data feed of multiple cameras.
class Feed:
    def __init__(self, cameras: List[Camera], resolution: Tuple[int, int] | None = None):
        self.feeds = cameras
        self.set_resolution(resolution)
    
    """
    @method set_resolution | Set the resolution of all the camera feeds.
    """
    def set_resolution(self, resolution: Tuple[int, int] | None):
        if resolution is None:
            return
        
        for feed in self.feeds:
            feed.stream.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
            feed.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])

            # Check if the resolution was actually set
            actual_width = int(feed.stream.get(cv2.CAP_PROP_FRAME_WIDTH))
            actual_height = int(feed.stream.get(cv2.CAP_PROP_FRAME_HEIGHT))

            if actual_width != resolution[0] or actual_height != resolution[1]:
                print(f"Warning: Camera {feed.stream} - Unable to set resolution to {resolution}. Using {(actual_width, actual_height)} instead.")
            else:
                print(f"Camera {feed.stream} - Successfully set resolution to {resolution}")

    
    """
    @method capture | Capture frames from all camera feeds and return them as a list of numpy arrays.
    """
    def capture(self) -> List[np.ndarray]:
        return [feed.update() for feed in self.feeds]
    

    """
    @method display | Display the feeds from all cameras in a single window
    """
    def display(self, feeds: List[np.ndarray]):
        combined_frame = np.hstack(feeds)
        cv2.imshow('Feed', combined_frame)

    
    """
    @method release | Release all camera feeds
    """
    def release(self):
        for feed in self.feeds:
            feed.stream.release()



# UTILITY FUNCTIONS
"""
@function get_frame_diff | Returns a value representing the difference between two frames.
"""
def get_frame_diff(prev_frame: np.ndarray, new_frame: np.ndarray, threshold: int) -> int:
    # convert frames to grayscale
    prev_frame = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    new_frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2GRAY)

    # calculate the difference between the previous and new frames
    diff_frame = cv2.absdiff(prev_frame, new_frame)

    # threshold the difference frames
    thresholded_frame = cv2.threshold(diff_frame, threshold, 255, cv2.THRESH_BINARY)

    #count the number of non-zero pixels in the thresholded frames
    num_non_zero_pixels = np.count_nonzero(thresholded_frame[1])

    return num_non_zero_pixels

def get_difference_sum(prev_frame: np.ndarray, new_frame: np.ndarray, threshold: int) -> int:
    # convert frames to grayscale
    prev_frame = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    new_frame = cv2.cvtColor(new_frame, cv2.COLOR_BGR2GRAY)

    # calculate the positive or negative difference between the previous and new frames
    diff_frame = prev_frame - new_frame

    # threshold the difference frames


