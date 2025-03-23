package com.youtext.app.model;

import java.util.List;

public class TranscriptResponse {
    private boolean success;
    private Object transcript; 
    private String error;

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getTranscript() {
        return transcript;
    }

    public void setTranscript(Object transcript) {
        this.transcript = transcript;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    // Nested class for timestamped entries
    public static class TranscriptEntry {
        private String text;
        private double offset;
        private double duration;

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public double getOffset() {
            return offset;
        }

        public void setOffset(double offset) {
            this.offset = offset;
        }

        public double getDuration() {
            return duration;
        }

        public void setDuration(double duration) {
            this.duration = duration;
        }
    }
}