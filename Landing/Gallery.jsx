import React, { useState } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Step 1: Create random aspect ratio list
const generatePhotos = () => {
    const photos = [];
    for (let i = 1; i <= 42; i++) {
        const width = Math.floor(Math.random() * 3) + 2; // random width: 2 to 4
        const height = Math.floor(Math.random() * 3) + 2; // random height: 2 to 4
        photos.push({
            src: `/src/assets/images/img${i}.jpg`,
            width,
            height,
            alt: `Image ${i}`,
        });
    }
    return photos;
};

const photoList = generatePhotos();

const Gallery = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [viewerIsOpen, setViewerIsOpen] = useState(false);

    const openLightbox = (event, { photo, index }) => {
        setCurrentImage(index);
        setViewerIsOpen(true);
    };

    const closeLightbox = () => {
        setCurrentImage(0);
        setViewerIsOpen(false);
    };

    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <Gallery
                photos={photoList}
                onClick={openLightbox}
                margin={6}
                direction="row"
            />
            <ModalGateway>
                {viewerIsOpen ? (
                    <Modal onClose={closeLightbox}>
                        <Carousel
                            currentIndex={currentImage}
                            views={photoList.map((x) => ({
                                ...x,
                                srcset: x.src,
                                caption: x.alt,
                            }))}
                        />
                    </Modal>
                ) : null}
            </ModalGateway>
        </motion.div>
    );
};

export default Gallery;
