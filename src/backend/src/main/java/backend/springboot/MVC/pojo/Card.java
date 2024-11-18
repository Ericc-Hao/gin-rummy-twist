package backend.springboot.MVC.pojo;

public class Card {

    public int getGameId() {
        return gameId;
    }

    public void setGameId(int gameId) {
        this.gameId = gameId;
    }

    public int getCardId() {
        return cardId;
    }

    public void setCardId(int cardId) {
        this.cardId = cardId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    private int gameId;
    private int cardId;
    private String color;
    private String value;

    // Constructor
    public Card(int cardId, String color, String value, int gameId) {
        this.cardId = cardId;
        this.color = color;
        this.value = value;
        this.gameId = gameId;
    }
}
