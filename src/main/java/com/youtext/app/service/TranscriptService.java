package com.youtext.app.service;

import com.google.gson.Gson;
import com.youtext.app.model.TranscriptResponse;

import org.asynchttpclient.*;
import org.springframework.stereotype.Service;

@Service
public class TranscriptService {
    private static final String API_KEY = "bbd0650573msh2c6e0c1746b09f0p1090d2jsnb7088671a87e"; 
    private static final String API_HOST = "youtube-transcript3.p.rapidapi.com";
    private final Gson gson = new Gson();

    public String getTranscript(String youtubeUrl, String lang) {
        try (AsyncHttpClient client = new DefaultAsyncHttpClient()) {
            BoundRequestBuilder requestBuilder = client.prepareGet("https://youtube-transcript3.p.rapidapi.com/api/transcript-with-url")
                    .setHeader("x-rapidapi-key", API_KEY)
                    .setHeader("x-rapidapi-host", API_HOST)
                    .addQueryParam("url", youtubeUrl)
                    .addQueryParam("lang", lang);

            Request request = requestBuilder.build();
            String responseBody = client.executeRequest(request)
                    .toCompletableFuture()
                    .thenApply(response -> response.getResponseBody())
                    .join();

            TranscriptResponse transcriptResponse = gson.fromJson(responseBody, TranscriptResponse.class);
            
            if (transcriptResponse == null) {
                transcriptResponse = new TranscriptResponse();
                transcriptResponse.setSuccess(false);
                transcriptResponse.setError("Invalid response from API");
            }
            
            return gson.toJson(transcriptResponse);
        } catch (Exception e) {
            TranscriptResponse errorResponse = new TranscriptResponse();
            errorResponse.setSuccess(false);
            errorResponse.setError("Error fetching transcript: " + e.getMessage());
            return gson.toJson(errorResponse);
        }
    }
}