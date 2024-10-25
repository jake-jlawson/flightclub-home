import cv2
import numpy as np
import os

def calculate_centerline(mask):
    # Convert mask to grayscale (if it's not already)
    if len(mask.shape) == 3:  # Check if the mask is 3-channel (BGR)
        mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
    else:
        mask_gray = mask

    # Threshold the mask to create a binary image (if necessary)
    _, binary_mask = cv2.threshold(mask_gray, 1, 255, cv2.THRESH_BINARY)

    # Find contours in the binary mask
    contours, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # List to hold the center points of filtered contours
    center_points = []

    for contour in contours:
        # Calculate the area of the contour
        area = cv2.contourArea(contour)

        # Filter contours based on area to keep only the long slender parts
        if area > 100:  # Adjust this threshold based on your scene
            # Calculate the centroid of the contour
            M = cv2.moments(contour)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                center_points.append((cX, cY))

    # Draw the centerline if we have center points
    if len(center_points) > 1:  # Ensure there are at least two points to draw a line
        for i in range(1, len(center_points)):
            cv2.line(mask, center_points[i - 1], center_points[i], (0, 255, 0), 2)  # Green line for centerline

    return mask

def main():
    # Check the current working directory
    print("Current Working Directory:", os.getcwd())
    
    # Initialize video capture (0 for the default camera)
    cap = cv2.VideoCapture(2)

    # Read the first frame to establish a baseline
    ret, prev_frame = cap.read()
    if not ret:
        print("Error: Could not read from camera.")
        return

    prev_frame_gray = cv2.cvtColor(prev_frame, cv2.COLOR_BGR2GRAY)
    prev_frame_gray = cv2.GaussianBlur(prev_frame_gray, (5, 5), 0)

    stable_frame_count = 0
    stable_frames_threshold = 30  # Number of frames to consider as stable
    threshold = 30  # Sensitivity of change detection
    dart_landed = False
    landed_frame = None  # Variable to store the landed frame

    while True:
        # Read the next frame
        ret, frame = cap.read()
        if not ret:
            break

        # Convert the current frame to grayscale and apply Gaussian blur
        current_frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        current_frame_gray = cv2.GaussianBlur(current_frame_gray, (5, 5), 0)

        # Compute the absolute difference between the current frame and the previous frame
        frame_diff = cv2.absdiff(prev_frame_gray, current_frame_gray)

        # Threshold the difference to highlight significant changes
        _, thresh = cv2.threshold(frame_diff, threshold, 255, cv2.THRESH_BINARY)

        # After thresholding
        kernel = np.ones((5, 5), np.uint8)  # Create a kernel for morphological operations
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)  # Remove small noise
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)  # Fill small holes

        # Count the number of non-zero pixels in the thresholded image
        non_zero_count = cv2.countNonZero(thresh)

        # Print out the number of non-zero pixels for debugging
        print(f"Non-zero pixel count: {non_zero_count}")

        # Check if the non-zero pixel count exceeds the threshold
        if non_zero_count > 500:  # Adjust based on your scene
            stable_frame_count = 0  # Reset stable frame counter
            dart_landed = False  # Reset the dart landed flag
        else:
            stable_frame_count += 1

        # If stable for enough frames and a dart hasn't landed yet, capture the frame
        if stable_frame_count > stable_frames_threshold and not dart_landed:
            # Capture the current stable frame
            if landed_frame is not None:
                # Calculate pixel differences between the current stable frame and the previous landed frame
                stable_frame_diff = cv2.absdiff(landed_frame, frame)
                _, stable_thresh = cv2.threshold(stable_frame_diff, threshold, 255, cv2.THRESH_BINARY)

                # Create a red mask for significant changes
                mask = np.zeros_like(frame)  # Create a mask with the same size as the frame
                # Create a red image of the same shape as the frame
                red_image = np.zeros_like(frame)
                red_image[:] = [0, 0, 255]  # Set all pixels to red

                # Use the stable_thresh to mask the red image
                mask[stable_thresh > 0] = red_image[stable_thresh > 0]  # Assign red color where changes are detected

                # Calculate the centerline of the mask
                mask_with_centerline = calculate_centerline(mask)

                # Overlay the mask on the current frame
                overlay = cv2.addWeighted(frame, 0.7, mask, 0.3, 0)

                # Display the overlay with changes
                cv2.imshow('Changes Detected', overlay)

            # Capture the new stable frame
            landed_frame = frame.copy()  # Capture the current frame
            print("Dart landed detected!")
            dart_landed = True  # Set the flag to indicate the dart has landed

        # Display the current frame for visualization
        cv2.imshow('Video', frame)

        # If a dart has landed, display the captured frame
        if dart_landed and landed_frame is not None:
            cv2.imshow('Dart Landed', landed_frame)

        # Update the previous frame
        prev_frame_gray = current_frame_gray

        # Break the loop on 'q' key press
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

    # Release video capture and close windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()