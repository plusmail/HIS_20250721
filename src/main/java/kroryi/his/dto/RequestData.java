package kroryi.his.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestData{
    private List<String> newValue;
    private int subListIndex;
}