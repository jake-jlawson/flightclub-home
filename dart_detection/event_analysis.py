"""
    EVENT_ANALYSIS.PY
    ~~~~~~
    This module provides a loop to analyse the video feed from the cameras and detect events.
    Once an event is detected the module will stop the loop and return details about the event.
"""
# IMPORTS
from feed_capture2 import Feed
import cv2
import time
import numpy as np

# Constants
EVENT_TYPES = ["dart_hit", "dart_removed", "no_event"]

# PARAMETERS
DETECTION_SETTINGS = {
    "instability_detection_threshold": 20,
    "instability_end_threshold": 1
}


# CLASS: EventDetector
class EventDetector:
    def __init__(self):
        pass
    
    """
    @method run | Runs the loop to detect events. Returns the type of event once it has been detected.
    """
    def run(self, feed: Feed):
        pre_event_image = None
        post_event_image = None
       
       
        # Event detection loop
        while True:

            # Capture frames
            frames = feed.capture()
            feed.display(frames) # Display the frames

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

            # Analyse frames instability
            frames_instability = [cam.get_image_instability() for cam in feed.feeds]
            instability = sum(frames_instability)


            # Detect event
            if (instability > DETECTION_SETTINGS["instability_detection_threshold"]):
                print("Event detected")
                event_start_time = time.time()
                
                # Get the image with the highest instability (most likely to be the best view of the event)
                index_of_highest_instability = frames_instability.index(max(frames_instability))
                pre_event_image = feed.feeds[index_of_highest_instability].prev_frame
                cv2.imwrite("./test_images/pre_event_image.jpg", pre_event_image)
                cv2.imshow("Pre-event image", pre_event_image)
                break


        # Event monitoring loop
        # wait for the event to finish
        while True:
            # Capture frames
            frames = feed.capture()
            feed.display(frames) # Display the frames

            # Analyse frames instability
            frames_instability = [cam.get_image_instability() for cam in feed.feeds]
            instability = sum(frames_instability)


            # Detect when the event is finished (instability returns to normal)
            if (instability < DETECTION_SETTINGS["instability_end_threshold"]):
                event_end_time = time.time()
                post_event_image = feed.feeds[index_of_highest_instability].current_frame
                cv2.imwrite("./test_images/post_event_image.jpg", post_event_image)
                cv2.imshow("Post-event image", post_event_image)
                break

        
        # Analyse the type of event
        type_of_event = classify_event(pre_event_image, post_event_image)
        type_of_event_string = EVENT_TYPES[type_of_event]

        print(type_of_event_string, "event detected")
        return EVENT_TYPES[0]



# UTILITY FUNCTIONS
def classify_event(pre_event_image, post_event_image):
    # convert images to grayscale
    pre_event_image_gray = cv2.cvtColor(pre_event_image, cv2.COLOR_BGR2GRAY)
    post_event_image_gray = cv2.cvtColor(post_event_image, cv2.COLOR_BGR2GRAY)
    cv2.imshow("Pre-event image", pre_event_image)
    cv2.imshow("Post-event image", post_event_image)

    #apply gaussian blur to the images to reduce noise
    pre_event_image_blurred = cv2.GaussianBlur(pre_event_image_gray, (5, 5), 0)
    post_event_image_blurred = cv2.GaussianBlur(post_event_image_gray, (5, 5), 0)
    
    # get difference mask between pre and post event images
    difference_mask = cv2.absdiff(pre_event_image_gray, post_event_image_gray)

    # threshold the difference mask
    _, difference_mask_thresholded = cv2.threshold(difference_mask, 50, 255, cv2.THRESH_BINARY)

    result1 = cv2.bitwise_and(pre_event_image, pre_event_image, mask=difference_mask_thresholded)
    result2 = cv2.bitwise_and(post_event_image, post_event_image, mask=difference_mask_thresholded)




    cv2.imshow("Difference mask", difference_mask_thresholded)
    cv2.imshow("Result 1", result1)
    cv2.imshow("Result 2", result2)

    return 0