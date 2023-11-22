package com.image.service;

import com.image.entity.ImageData;
import com.image.responseMessage.ApiResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface ImageDataService {

    public ApiResponse<ImageData> saveImageData(ImageData imageData);

    public ApiResponse<List<ImageData>> getAllImagesData();

    public ApiResponse<ImageData> deleteImageData(Long id);
}