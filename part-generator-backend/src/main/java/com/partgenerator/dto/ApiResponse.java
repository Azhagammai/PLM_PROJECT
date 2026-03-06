package com.partgenerator.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> ok(T data, String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.setSuccess(true);
        r.setMessage(message);
        r.setData(data);
        return r;
    }

    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> r = new ApiResponse<>();
        r.setSuccess(false);
        r.setMessage(message);
        return r;
    }
}
