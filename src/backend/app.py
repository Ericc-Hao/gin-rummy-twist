from time import sleep
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from lib.authentication import Authentication
from lib.match import Match
import random
import datetime
import json

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', "https://ginrummys.ca"])



auth = Authentication()
ongoing_matches = {}
rooms = {}

server_start_time = datetime.datetime.now()

@app.route("/")
def index():
    return render_template("status.html", 
                           version = "0.0.1-rc1",
                           start_time = server_start_time.timestamp())

@app.route('/api/signup', methods=['POST'])
def signup_request():
    if auth.create_account(request.json['username'], request.json['password']):
        return jsonify({
            'result': 0, 
            "message": "OK"
        })
    return jsonify({
        'result': 1, 
        "message": "Account already exists"
    })

@app.route('/api/login', methods=['POST'])
def login_request():
    code, message = auth.verify_account(request.json['username'], request.json['password'])
    return jsonify({
        'result': code, 
        "message": message
    })

@app.route('/api/join', methods=['POST'])
def join_request():
    match_id = request.json['matchid']
    code, message = 0, "OK"
    if not match_id in rooms.keys():
        code, message = 420, "Room Not Found"
    if rooms[match_id]:
        code, message = 421, "Room Already Full"
    else:
        code, message = 200, "Joined"
        rooms[match_id] = True
    return jsonify({
        'result': code, 
        "message": message
    })

@app.route('/api/match_create', methods=['POST'])
def match_create_request():
    match_id = "test"
    if match_id in rooms:
        match_id = ''.join(random.choices("abcdefghijklmnopqrstuvwxyz", k=4))
        print(match_id)
    rooms[match_id] = False
    need_bot = False
    print(request.json, "isBot?", request.json['bot'])
    if request.json['bot'] == "True":
        need_bot = True
        print("Bot needed")
    ongoing_matches[match_id] = Match(match_id, bot=need_bot)

    return jsonify({
        'result': 0, 
        'message': "OK",
        'match_id': match_id,})

@app.route('/api/room_status', methods=['POST'])
def check_room_status():
    match_id = request.json['matchid']
    if not match_id in rooms:
        code, message = 1, "Room Not Found"
    if rooms[match_id]:
        code, message = 0, "Second Player Joined"
    else:
        code, message = 2, "Second Player not yet joined"
    return jsonify({
        'result': code, 
        "message": message
    })

@app.route('/api/match_start', methods=['POST'])
def match_start_request():
    match_id = request.json['matchid']
    print(request.json)

    # ✅ 只有第一次调用时才创建 Match
    if match_id not in ongoing_matches:
        ongoing_matches[match_id] = Match(match_id)

    ongoing_matches[match_id].initialize_match(int(request.json['round']))

    match_obj = ongoing_matches[match_id]
    init_cards = match_obj.get_initial_cards()

    # ongoing_matches[match_id] = Match(match_id)
    # init_cards = ongoing_matches[match_id].get_initial_cards()
    code, message = 0, "OK"
    return jsonify({
        'result': code, 
        'message': message,
        'match_id': match_id,
        
        'order0':init_cards[0]["order"], 'point0':init_cards[0]["point"], 'name0':init_cards[0]["name"], 'image0':init_cards[0]["image"], 'color0':init_cards[0]["color"], 'text0':init_cards[0]["text"],
        'order1':init_cards[1]["order"], 'point1':init_cards[1]["point"], 'name1':init_cards[1]["name"], 'image1':init_cards[1]["image"], 'color1':init_cards[1]["color"], 'text1':init_cards[1]["text"],
        'order2':init_cards[2]["order"], 'point2':init_cards[2]["point"], 'name2':init_cards[2]["name"], 'image2':init_cards[2]["image"], 'color2':init_cards[2]["color"], 'text2':init_cards[2]["text"],
        'order3':init_cards[3]["order"], 'point3':init_cards[3]["point"], 'name3':init_cards[3]["name"], 'image3':init_cards[3]["image"], 'color3':init_cards[3]["color"], 'text3':init_cards[3]["text"],
        'order4':init_cards[4]["order"], 'point4':init_cards[4]["point"], 'name4':init_cards[4]["name"], 'image4':init_cards[4]["image"], 'color4':init_cards[4]["color"], 'text4':init_cards[4]["text"],
        'order5':init_cards[5]["order"], 'point5':init_cards[5]["point"], 'name5':init_cards[5]["name"], 'image5':init_cards[5]["image"], 'color5':init_cards[5]["color"], 'text5':init_cards[5]["text"],
        'order6':init_cards[6]["order"], 'point6':init_cards[6]["point"], 'name6':init_cards[6]["name"], 'image6':init_cards[6]["image"], 'color6':init_cards[6]["color"], 'text6':init_cards[6]["text"],
        'order7':init_cards[7]["order"], 'point7':init_cards[7]["point"], 'name7':init_cards[7]["name"], 'image7':init_cards[7]["image"], 'color7':init_cards[7]["color"], 'text7':init_cards[7]["text"],
        'order8':init_cards[8]["order"], 'point8':init_cards[8]["point"], 'name8':init_cards[8]["name"], 'image8':init_cards[8]["image"], 'color8':init_cards[8]["color"], 'text8':init_cards[8]["text"],
        'order9':init_cards[9]["order"], 'point9':init_cards[9]["point"], 'name9':init_cards[9]["name"], 'image9':init_cards[9]["image"], 'color9':init_cards[9]["color"], 'text9':init_cards[9]["text"],
        'order10':init_cards[10]["order"], 'point10':init_cards[10]["point"], 'name10':init_cards[10]["name"], 'image10':init_cards[10]["image"], 'color10':init_cards[10]["color"], 'text10':init_cards[10]["text"],
        'order11':init_cards[11]["order"], 'point11':init_cards[11]["point"], 'name11':init_cards[11]["name"], 'image11':init_cards[11]["image"], 'color11':init_cards[11]["color"], 'text11':init_cards[11]["text"],
        'order12':init_cards[12]["order"], 'point12':init_cards[12]["point"], 'name12':init_cards[12]["name"], 'image12':init_cards[12]["image"], 'color12':init_cards[12]["color"], 'text12':init_cards[12]["text"],
        'order13':init_cards[13]["order"], 'point13':init_cards[13]["point"], 'name13':init_cards[13]["name"], 'image13':init_cards[13]["image"], 'color13':init_cards[13]["color"], 'text13':init_cards[13]["text"],
        'order14':init_cards[14]["order"], 'point14':init_cards[14]["point"], 'name14':init_cards[14]["name"], 'image14':init_cards[14]["image"], 'color14':init_cards[14]["color"], 'text14':init_cards[14]["text"],
        'order15':init_cards[15]["order"], 'point15':init_cards[15]["point"], 'name15':init_cards[15]["name"], 'image15':init_cards[15]["image"], 'color15':init_cards[15]["color"], 'text15':init_cards[15]["text"],
        'order16':init_cards[16]["order"], 'point16':init_cards[16]["point"], 'name16':init_cards[16]["name"], 'image16':init_cards[16]["image"], 'color16':init_cards[16]["color"], 'text16':init_cards[16]["text"],
        'order17':init_cards[17]["order"], 'point17':init_cards[17]["point"], 'name17':init_cards[17]["name"], 'image17':init_cards[17]["image"], 'color17':init_cards[17]["color"], 'text17':init_cards[17]["text"],
        'order18':init_cards[18]["order"], 'point18':init_cards[18]["point"], 'name18':init_cards[18]["name"], 'image18':init_cards[18]["image"], 'color18':init_cards[18]["color"], 'text18':init_cards[18]["text"],
        'order19':init_cards[19]["order"], 'point19':init_cards[19]["point"], 'name19':init_cards[19]["name"], 'image19':init_cards[19]["image"], 'color19':init_cards[19]["color"], 'text19':init_cards[19]["text"],
        'order20':init_cards[20]["order"], 'point20':init_cards[20]["point"], 'name20':init_cards[20]["name"], 'image20':init_cards[20]["image"], 'color20':init_cards[20]["color"], 'text20':init_cards[20]["text"],
        'order21':init_cards[21]["order"], 'point21':init_cards[21]["point"], 'name21':init_cards[21]["name"], 'image21':init_cards[21]["image"], 'color21':init_cards[21]["color"], 'text21':init_cards[21]["text"],
        'order22':init_cards[22]["order"], 'point22':init_cards[22]["point"], 'name22':init_cards[22]["name"], 'image22':init_cards[22]["image"], 'color22':init_cards[22]["color"], 'text22':init_cards[22]["text"],
        'order23':init_cards[23]["order"], 'point23':init_cards[23]["point"], 'name23':init_cards[23]["name"], 'image23':init_cards[23]["image"], 'color23':init_cards[23]["color"], 'text23':init_cards[23]["text"],
        'order24':init_cards[24]["order"], 'point24':init_cards[24]["point"], 'name24':init_cards[24]["name"], 'image24':init_cards[24]["image"], 'color24':init_cards[24]["color"], 'text24':init_cards[24]["text"],                                                                                                                                                                                                    
    })


# @app.route('/api/add_bot', methods=['POST'])
# def add_bot_request():
#     code, message = 0, "OK"
#     return jsonify({
#         'result': code, 
#         "message": message
#     })


# missing operation
@app.route('/api/match_move', methods=['POST', 'GET'])
def move_request():
    print("info", request.json)
    target_match = ongoing_matches.get(request.json['matchid'])
    
    if target_match == None:
        return jsonify({
            'result': 1, 
            "message": "Match not found"
        })
    
    if request.json['move'] == "stack":
        new_card = target_match.choose_stack(request.json['host'])
        return jsonify({
            'result': 0, 
            "message": "OK",
            'order':new_card["order"], 
            'point':new_card["point"], 
            'name':new_card["name"], 
            'image':new_card["image"], 
            'color':new_card["color"], 
            'text':new_card["text"]
        })
    
    # if request.json['move'] == "dropzone":
    #     target_match.choose_drop_zone(request.json['host'])
    #     return jsonify({
    #         'result': 0, 
    #         "message": "OK"
    #     })

    if request.json['move'] == "dropzone":
        if len(target_match.drop_zone) == 0:
            return jsonify({'result': 1, 'message': 'Drop zone is empty'})
        
        new_card = target_match.choose_drop_zone(request.json['host'])
        return jsonify({
            'result': 0,
            'message': 'OK',
            'order': new_card["order"],
            'point': new_card["point"],
            'name': new_card["name"],
            'image': new_card["image"],
            'color': new_card["color"],
            'text': new_card["text"]
        })

    
    if request.json['move'] == "drop": 
        target_match.drop_card(request.json['host'], request.json['dropped_card_name'])
        return jsonify({
            'result': 0, 
            "message": "OK"
        })

    if request.json['move'] == "opponent_status":
        sleep(1)
        last_player, last_op, last_card, last_picked_card = target_match.get_latest_operation()
        print(last_player, request.json['host'], last_op, last_card, last_picked_card)
        if last_player == request.json['host']:
            print("return 1")
            return jsonify({
                'result': 1, 
                "message": "Still Waiting",
            })
        print("return 0")
        return jsonify({
            'result': 0, 
            "message": "Ready",
        })
        
    if request.json['move'] == "wait_opponent":
        # last_card : dropped card
        # last_picked_card : picked card
        last_player, last_op, last_card, last_picked_card = target_match.get_latest_operation()
        print("operation", last_player, last_op, last_card, last_picked_card)

        print("last_drop_type", type(last_card), last_card)
        print("last_picked_type", type(last_picked_card), last_picked_card)
        """
        last_player = request.json['host']
        if last_player == request.json['host']:
            
            print(last_player, request.json['host'], last_op, last_card, last_picked_card)
            return jsonify({
                'result': 1, 
                "message": "Still Waiting",
            })"""
        return jsonify({
            'result': last_player, 
            "message": "OK",
            "operation": last_op,
            "dropped_card": json.dumps(last_card),
            "new_card": json.dumps(last_picked_card)
        })


game_started = {}

@app.route('/api/set_game_start', methods=['POST'])
def set_game_start():
    match_id = request.json.get('matchid')
    # if match_id not in rooms:
    #     return jsonify({'result': 1, 'message': 'Room Not Found'})
    game_started[match_id] = True
    return jsonify({'result': 0, 'message': 'Game started successfully'})

@app.route('/api/is_game_started', methods=['POST'])
def is_game_started():
    match_id = request.json.get('matchid')
    if match_id not in rooms:
        return jsonify({'result': 1, 'message': 'Room Not Found'})
    started = game_started.get(match_id, False)
    if started:
        return jsonify({'result': 0, 'message': 'Game has started'})
    else:
        return jsonify({'result': 2, 'message': 'Game not started yet'})


game_dealing_started = {}


@app.route('/api/set_game_dealing_started', methods=['POST'])
def set_game_dealing_started():
    match_id = request.json.get('matchid')
    game_dealing_started[match_id] = True
    return jsonify({'result': 0, 'message': 'Game dealing started'})

@app.route('/api/is_game_dealing_started', methods=['POST'])
def is_game_dealing_started():
    match_id = request.json.get('matchid')
    started = game_dealing_started.get(match_id, False)
    if started:
        return jsonify({'result': 0, 'message': 'Dealing started'})
    else:
        return jsonify({'result': 1, 'message': 'Not started yet'})


pass_status = {}  # 用于记录 match_id -> 是否 host 已点击 pass

@app.route('/api/set_passed', methods=['POST'])
def set_passed():
    match_id = request.json.get('matchid')
    pass_status[match_id] = True
    return jsonify({'result': 0, 'message': 'Pass set'})

@app.route('/api/is_passed', methods=['POST'])
def is_passed():
    match_id = request.json.get('matchid')
    if ongoing_matches.get(request.json['matchid']).latest_player == '1':
        return jsonify({'result': 2, 'message': 'Host Made a move'})
    if pass_status.get(match_id, False):
        # 检测到 pass 之后就清掉
        pass_status[match_id] = False
        return jsonify({'result': 0, 'message': 'Host passed'})
    else:
        return jsonify({'result': 1, 'message': 'Not passed yet'})




if __name__ == '__main__':
    
    app.run(debug=True, port=8080)