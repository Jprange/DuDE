from collections import OrderedDict

class Program(object):
    def __init__(self, statements):
        self.statements = statements
        self.states = []
        self.current_state = OrderedDict()

    def evaluate(self):
        try:
            for s in self.statements:
                Statement(s['id'], s['type'], s.get('data', None),
                          self.current_state, self.states)()
        except (NameError, TypeError) as e:
            self.states.append({'id': -1, 'error': 'Error while executing statement <{0}>: {1}'.format(s['id'], str(e))})

        return self.states


class Statement(object):

    def __init__(self, id, type, data, current_state, states):
        self.id = id
        self.type = type
        self.data = data
        self.current_state = current_state
        self.states = states

    def __call__(self):


        if self.type == 'assignment':
            varname = self.data['varname']
            expr = self.data['expr']

            self.current_state[varname] = eval(expr)

            globals().update(self.current_state)

            self.states.append({
                'id': self.id,
                'state': ['{} = {}'.format(k,v) for (k,v)
                          in self.current_state.items()]
            })

        elif self.type == 'if':
            predicate = self.data['predicate']
            branch = self.data['branch']

            self.states.append({
                'id': self.id,
                'state': ['{} = {}'.format(k,v) for (k,v)
                          in self.current_state.items()]
            })

            if eval(predicate):
                for s in branch:
                    Statement(s['id'],s['type'],s['data'],
                              self.current_state, self.states)()

        elif self.type == 'loop':
            predicate = self.data['predicate']
            branch = self.data['branch']

            self.states.append({
                'id': self.id,
                'state': ['{} = {}'.format(k,v) for (k,v)
                        in self.current_state.items()]
            })

            while eval(predicate):

                for s in branch:
                    Statement(s['id'],s['type'],s['data'],
                              self.current_state, self.states)()

                self.states.append({
                    'id': self.id,
                    'state': ['{} = {}'.format(k,v) for (k,v)
                            in self.current_state.items()]
                })


        elif self.type in ('endif', 'begin', 'endloop'):
            self.states.append({
                'id': self.id,
                'state': ['{} = {}'.format(k,v) for (k,v)
                          in self.current_state.items()]
            })

        else:
            raise AttributeError('Invalid type: <{}>'.format(self.type))
