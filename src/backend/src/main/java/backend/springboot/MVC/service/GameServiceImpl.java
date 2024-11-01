package backend.springboot.MVC.service;

import backend.springboot.MVC.mapper.GameMapper;
import backend.springboot.MVC.pojo.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class GameServiceImpl {
    @Autowired
    private GameMapper gameMapper;

    public int gameInitialization()
    {
        int gameId = generateGameId();
        List<Card> cardSet = new ArrayList<>();
        String[] colors = {"Spade", "Heart", "Diamond", "Club"};
        String[] values = {"0A", "0B", "C", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"};
        int cardId = 0;
        for (String color : colors)
        {
            for (String value : values) {
                cardSet.add(new Card(cardId, color, value, gameId));
                cardId++;
            }
        }
        Collections.shuffle(cardSet);
        // Store each card in the database
        for (Card card : cardSet) {
            gameMapper.insertCard(card);
        }
        return gameId;
    }

    private int generateGameId() {
        // Implement your logic to generate a unique gameId
        return (int) (Math.random() * 100000);
    }
}
