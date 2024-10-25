import cv2
import typing
from typing import Tuple, List
import numpy as np
import time
import os
from collections import deque


CAMERA_SETTINGS = {
    "stability_time_horizon": 10,
    "change_threshold": 100
}



class Camera:
    def __init__(self, stream: cv2.VideoCapture):
        
        # OPENCV CAMERA STREAM
        self.stream = stream #openCV camera stream

        # check camera stream is working correctly
        if not self.stream.isOpened(): 
            print(f"Error opening camera feed {self.stream}")


        #IMAGE INFORMATION
        self.prev_frame = self.stream.read()[1]
        self.current_frame = self.prev_frame


        #IMAGE STABILITY TRACKING
        self.instability_vals = deque(maxlen=CAMERA_SETTINGS["stability_time_horizon"]) #track last n stability values
        self.image_instability_total = 0 #track sum


    """
    METHOD: capture_frame
    _________________________________________________________________________________________
    Capture a frame from the camera stream and return it as a numpy array.
    """
    def capture_frame(self) -> np.ndarray:
        # set previous frame to current frame
        self.prev_frame = self.current_frame
        
        # get new frame
        ret, frame = self.stream.read()
        if not ret:
            print(f"Error capturing frame from feed {self.stream}")
            frame = np.zeros((480, 640, 3), dtype=np.uint8)  # Blank frame if capture fails

        # set current frame to the new frame
        self.current_frame = frame

        return frame
    

    """
    METHOD: get_change
    _________________________________________________________________________________________
    Get the total pixels difference between the previous and current frame.
    """
    def get_change(self, threshold: int) -> int:
        return frame_diff_value(self.prev_frame, self.current_frame, threshold)
    

    """
    METHOD: get_image_instability
    _________________________________________________________________________________________
    Get the current image instability of the camera.
    - Image instability is the moving average of the total pixels difference between the previous and current frame.
    - When the image is stable, the image instability will be low.
    - When the image is changing, the image instability will be high.
    """
    def get_image_instability(self) -> int:
        diff_value = self.get_change(CAMERA_SETTINGS["change_threshold"]) #get the total pixels difference between the previous and current frame

        #remove the oldest instability value if the deque is full
        if len(self.instability_vals) == CAMERA_SETTINGS["stability_time_horizon"]: 
            self.image_instability_total -= self.instability_vals[0]

        #add the new instability value to the deque
        self.instability_vals.append(diff_value)

        #update the total instability
        self.image_instability_total += diff_value

        return self.image_instability_total / len(self.instability_vals) #moving average of the instability values



    








class Feed:
    def __init__(self, feeds: List[Camera], fps: int = None, resolution: Tuple[int, int] = None):
        
        # SET UP CAMERA FEEDS
        self.feeds = feeds
        self.set_fps(fps)
        self.set_resolution(resolution)

        #ensure all camera feeds are open
        for feed in self.feeds:
            if not feed.stream.isOpened():
                print(f"Error opening camera feed {feed}")
                return


    """
    METHOD: set_fps
    _________________________________________________________________________________________
    Set the fps of the camera feeds.
    """
    def set_fps(self, fps):
        if fps is None:
            return
        
        self.fps = fps
        for feed in self.feeds:
            feed.stream.set(cv2.CAP_PROP_FPS, self.fps)

    
    """
    METHOD: set_resolution
    _________________________________________________________________________________________
    Set the resolution of the camera feeds.
    """
    def set_resolution(self, resolution: Tuple[int, int]):
        if resolution is None:
            return
        
        for feed in self.feeds:
            feed.stream.set(cv2.CAP_PROP_FRAME_WIDTH, resolution[0])
            feed.stream.set(cv2.CAP_PROP_FRAME_HEIGHT, resolution[1])


    """
    METHOD: set_fps
    _________________________________________________________________________________________
    Set the fps of the camera feeds.
    """
    def capture_frames(self) -> List[np.ndarray]:     
        return [feed.capture_frame() for feed in self.feeds]


    def display_feeds(self, feed_frames: List[np.ndarray]):
        # Ensure all frames have the same size before concatenating (resize if needed)
        frame_height, frame_width = feed_frames[0].shape[:2]
        resized_frames = [cv2.resize(frame, (frame_width, frame_height)) for frame in feed_frames]

        # Concatenate the frames horizontally (side by side)
        combined_frame = cv2.hconcat(resized_frames)

        # Display the combined frame
        cv2.imshow("Combined Camera Feeds", combined_frame)


    def release(self):
        for feed in self.feeds:
            feed.stream.release()


    def save_current_frame(self):
        frames = self.capture_frames()

        #save in ./test_images
        if not os.path.exists("./test_images"):
            os.makedirs("./test_images")

        cv2.imwrite(f"./test_images/frame_{time.time()}.jpg", frames[0])

    def save_frames(self, frames: List[np.ndarray]):
        #save in ./test_images
        if not os.path.exists("./test_images"):
            os.makedirs("./test_images")
        
        for i, frame in enumerate(frames):
            cv2.imwrite(f"./test_images/frame_{time.time()}_{i}.jpg", frame)



def frame_diff_values(prev_frames: List[np.ndarray], new_frames: List[np.ndarray], threshold: int) -> List[np.ndarray]:
    # convert frames to grayscale
    prev_frames = [cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) for frame in prev_frames]
    new_frames = [cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) for frame in new_frames]

    # calculate the difference between the previous and new frames
    diff_frames = [cv2.absdiff(prev_frame, new_frame) for prev_frame, new_frame in zip(prev_frames, new_frames)]

    # threshold the difference frames
    thresholded_frames = [cv2.threshold(diff_frame, threshold, 255, cv2.THRESH_BINARY) for diff_frame in diff_frames]

    #count the number of non-zero pixels in the thresholded frames
    num_non_zero_pixels = [np.count_nonzero(thresholded_frame[1]) for thresholded_frame in thresholded_frames]

    return num_non_zero_pixels


def frame_diff_value(prev_frame: np.ndarray, new_frame: np.ndarray, threshold: int) -> np.ndarray:
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