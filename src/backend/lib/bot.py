import random
class Bot():
    def __init__(self):
        pass

    def bot_draw(self, my_cards: list, drop_zone: dict, stack: list):
        
        return random.choice(["stack", "dropzone"])
        #return "stack"
    
    def bot_drop(self, my_cards: list):

        return random.randint(0, len(my_cards) - 2)