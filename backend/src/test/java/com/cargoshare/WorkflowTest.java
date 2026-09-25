package com.cargoshare;

import com.fasterxml.jackson.databind.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties="spring.datasource.url=jdbc:h2:mem:workflow;MODE=MySQL;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class WorkflowTest {
 @Autowired MockMvc mvc;
 @Autowired ObjectMapper json;
 String login(String email) throws Exception {
  return json.readTree(mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\""+email+"\",\"password\":\"password123\"}")).andExpect(status().isOk()).andReturn().getResponse().getContentAsString()).get("token").asText();
 }
 JsonNode postJson(String url,String token,String body,int status) throws Exception {
  String result=mvc.perform(post(url).header("Authorization","Bearer "+token).contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().is(status)).andReturn().getResponse().getContentAsString();
  return json.readTree(result);
 }
 @Test void completeWorkflowAndSecurity() throws Exception {
  String trader=login("trader@cargoshare.com"), admin=login("admin@cargoshare.com"), provider=login("provider@cargoshare.com");
  mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"admin@cargoshare.com\",\"password\":\"wrong\"}")).andExpect(status().isUnauthorized());
  String outsider=postJson("/api/auth/register/trader", "", "{\"name\":\"New exporter\",\"email\":\"new@export.test\",\"password\":\"password123\",\"traderType\":\"EXPORTER\"}",200).get("token").asText();
  postJson("/api/admin/providers/usr-p2/inspect",admin,"{\"approve\":true,\"notes\":\"Incomplete review\"}",400);
  postJson("/api/admin/providers/usr-p2/inspect",admin,"{\"approve\":true,\"notes\":\"Inspection and documents checked\",\"inspectionCompleted\":true,\"dataQualityVerified\":true}",200);
  JsonNode booking=postJson("/api/bookings",trader,"{\"containerId\":1,\"spaceRequired\":2,\"cargoDescription\":\"Test goods\"}",200);
    assertTrue(booking.get("providerContactName").asText().length() > 0);
  String id=booking.get("id").asText();
  mvc.perform(get("/api/bookings/"+id).header("Authorization","Bearer "+outsider)).andExpect(status().isForbidden());
  postJson("/api/payments/create-order",outsider,"{\"bookingId\":"+id.substring(4)+"}",403);
  postJson("/api/bookings",trader,"{\"containerId\":1,\"spaceRequired\":9999}",409);
  postJson("/api/bookings",trader,"{\"containerId\":1,\"spaceRequired\":-1}",400);
  postJson("/api/chat/messages",trader,"{\"receiverId\":3,\"senderId\":1,\"message\":\"Hello carrier\",\"bookingId\":"+id.substring(4)+"}",200);
  String history=mvc.perform(get("/api/chat/history?withUserId=2").header("Authorization","Bearer "+provider)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
  assertTrue(history.contains("Hello carrier"));
  postJson("/api/chat/messages",outsider,"{\"receiverId\":3,\"message\":\"intrusion\",\"bookingId\":"+id.substring(4)+"}",403);
  postJson("/api/bookings/"+id+"/cancel",trader,"{}",200);
  postJson("/api/bookings/"+id+"/cancel",trader,"{}",400);
  postJson("/api/payments/create-order",trader,"{\"bookingId\":"+id.substring(4)+"}",400);
  String users=mvc.perform(get("/api/admin/users").header("Authorization","Bearer "+admin)).andReturn().getResponse().getContentAsString();
  assertFalse(users.contains("password"));
  mvc.perform(put("/api/containers/CNT-1/update").header("Authorization","Bearer "+provider).contentType(MediaType.APPLICATION_JSON).content("{\"availableCapacity\":999}")).andExpect(status().isBadRequest());
 }
}
