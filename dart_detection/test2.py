import cv2
import numpy as np

#images
pre_event_image = cv2.imread("./test_images/pre_event_image.jpg")
post_event_image = cv2.imread("./test_images/post_event_image.jpg")


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
    _, difference_mask_thresholded = cv2.threshold(difference_mask, 60, 255, cv2.THRESH_BINARY)

    result1 = cv2.bitwise_and(pre_event_image, pre_event_image, mask=difference_mask_thresholded)
    result2 = cv2.bitwise_and(post_event_image, post_event_image, mask=difference_mask_thresholded)




    cv2.imshow("Difference mask", difference_mask_thresholded)
    cv2.imshow("Result 1", result1)
    cv2.imshow("Result 2", result2)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    
    print("Classifying event...")


def classify_event2(pre_event_image, post_event_image):
    #create gmg background subtractor
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(3,3))
    fgbg = cv2.createBackgroundSubtractorKNN


    fgmask_pre = fgbg.apply(pre_event_image)
    fgmask_pre = cv2.morphologyEx(fgmask_pre, cv2.MORPH_OPEN, kernel)
    fgmask_post = fgbg.apply(post_event_image)
    fgmask_post = cv2.morphologyEx(fgmask_post, cv2.MORPH_OPEN, kernel)

    std_dev_pre = np.std(fgmask_pre)
    std_dev_post = np.std(fgmask_post)

    # high standard deviation means the dart is most likely present in the image
    print("Standard deviation of pre-event image: ", std_dev_pre)
    print("Standard deviation of post-event image: ", std_dev_post)

    cv2.imshow("fgmask_pre", fgmask_pre)
    cv2.imshow("fgmask_post", fgmask_post)

    if std_dev_pre > std_dev_post:
        return 1
    else:
        return 0



classify_event2(pre_event_image, post_event_image)