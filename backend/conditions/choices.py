
def make_choices(_list):
    return tuple([(word, word) for word in _list])

state_list = ("completed", "failed", "yet started", "in progress")
state_choices = make_choices(state_list)