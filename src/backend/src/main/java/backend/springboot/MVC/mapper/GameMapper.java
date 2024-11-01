package backend.springboot.MVC.mapper;

import backend.springboot.MVC.pojo.Card;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface GameMapper {
    @Insert("INSERT INTO cardNotDrawn (cardId, color, value, gameId) VALUES (#{cardId}, #{color}, #{value}, #{gameId})")
    void insertCard(Card card);
}
