package org.sid.pfa.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserGroupDTO {
    private String name;
    private List<String> userEmails;
    private Long createdById;
}
