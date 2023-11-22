package com.image.controller;

import com.image.entity.ImageData;
import com.image.repository.ImageDataRepository;
import com.image.responseMessage.ApiResponse;
import com.image.service.ImageDataService;
import com.image.util.ImageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping(path = "image")
public class ImageUploadController {

    @Autowired
    ImageDataRepository imageDataRepository;

    @Autowired
    ImageDataService imageDataService;

    @PostMapping(value  = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<ImageData>> uploadImage(@RequestParam("imageFile") MultipartFile file) throws IOException {

        ImageData img = new ImageData(file.getOriginalFilename(), file.getContentType(), ImageUtil.compressBytes(file.getBytes()));
        imageDataRepository.save(img);

        ApiResponse<ImageData> apiResponse = imageDataService.saveImageData(img);

        if(apiResponse.getData() != null)
        {
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
    }


    @GetMapping
    @CrossOrigin
    public ApiResponse<List<ImageData>> getAllImages()
    {
        ApiResponse<List<ImageData>> apiResponse = imageDataService.getAllImagesData();

        List<ImageData> imageDataList = new ArrayList<>();

        apiResponse.getData().forEach(imageData -> {
            ImageData img = new ImageData(imageData.getId(), imageData.getName(),
                    imageData.getType(),ImageUtil.decompressBytes(imageData.getPicByte()));
            imageDataList.add(img);
        });

        apiResponse.setData(imageDataList);

        return ResponseEntity.status(apiResponse.getMessage().equals("Image List is fetched") ? HttpStatus.FOUND : HttpStatus.NO_CONTENT).body(apiResponse).getBody();
    }

    @GetMapping(path = { "/get/{imageId}" })
    public ResponseEntity<Optional<ImageData>> getImage(@PathVariable("imageId") int imageId) throws IOException {

        final Optional<ImageData> retrievedImage = imageDataRepository.findById(imageId);

        if(retrievedImage.isPresent())
        {
            ImageData img = new ImageData(retrievedImage.get().getId(), retrievedImage.get().getName(),
                    retrievedImage.get().getType(),
                ImageUtil.decompressBytes(retrievedImage.get().getPicByte()));
            return ResponseEntity.status(HttpStatus.CREATED).body(Optional.of(img));
        } else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);

    }

    @DeleteMapping("/{id}")
    public ApiResponse<ImageData> deleteImage(@PathVariable Long id)
    {
        ApiResponse<ImageData> apiResponse = imageDataService.deleteImageData(id);

        if(apiResponse.getData() != null)
        {
            return ResponseEntity.status(HttpStatus.FOUND).body(apiResponse).getBody();
        }else
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse).getBody();

    }
}
