"""
    APP.PY
    ~~~~~~
    This application serves as the processing module for the FlightClub home app.
    It is responsible for analysing the video feeds and of the dart game and performing 
    automatic dart detection and scoring.

"""
# IMPORTS
import cv2
from feed_capture2 import Camera, Feed
from event_analysis import EventDetector

# Camera Setup
CAMERAS = [
    Camera(cv2.VideoCapture(0)),
    Camera(cv2.VideoCapture(1)),
    Camera(cv2.VideoCapture(4))
]

# Camera Feeds
# ANALYSIS_FEED = Feed(CAMERAS, resolution=(1920, 1080)) # feed used for advanced analysis and scoring
EVENT_DETECTION_FEED = Feed(CAMERAS, resolution=None) # feed used for event detection



# MAIN FUNCTION
def main():
    while True:
        
        # get and display feeds
        event_detector = EventDetector()
        event_detector.run(EVENT_DETECTION_FEED)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the camera and close windows
    EVENT_DETECTION_FEED.release()
    cv2.destroyAllWindows()




if __name__ == "__main__":
    main()
