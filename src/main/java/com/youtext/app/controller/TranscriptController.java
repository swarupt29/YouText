package com.youtext.app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.youtext.app.service.TranscriptService;

@RestController
@RequestMapping("/api")
public class TranscriptController {
    
    @Autowired
    private TranscriptService transcriptService;
    
    @GetMapping(value = "/transcript", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getTranscript(
            @RequestParam("url") String youtubeUrl,
            @RequestParam(value = "lang", defaultValue = "en") String lang) {
        if (youtubeUrl == null || youtubeUrl.isEmpty()) {
            return ResponseEntity.badRequest()
                .body("{\"success\": false, \"error\": \"YouTube video URL is required\"}");
        }
        
        String transcript = transcriptService.getTranscript(youtubeUrl, lang);
        return ResponseEntity.ok(transcript);
    }
}