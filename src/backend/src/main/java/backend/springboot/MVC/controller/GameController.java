package backend.springboot.MVC.controller;

import backend.springboot.MVC.service.GameServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/game")
public class GameController {
    @Autowired
    private GameServiceImpl gameServiceImpl;

    @GetMapping("initialize")
    public int initialize() {
        return gameServiceImpl.gameInitialization();
    }
}

