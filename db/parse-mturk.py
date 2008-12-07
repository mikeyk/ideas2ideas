import csv
import re
# import file
import md5
import MySQLdb
import random
import math
import sqlite3

# conn = MySQLdb.connect (host = "128.12.109.149",
#                         port = 3306,
#                         user = "brainstorm2",
#                         passwd = "brainstorm2",
#                         db = "brainstorm2")
conn = sqlite3.connect('brainstorm')
cursor = conn.cursor ()

# row = cursor.fetchone ()
# print row[0]
# print "server version:", row[0]

stop_words = open('stop_words.txt', 'r').read().split()

class Assignment:
  def __init__(self):
    self.ideas = list()
    self.demo = dict()
    self.other_reason = None
    
  def __repr__(self):
    return "Demo: %s \n Ideas: %s" % (str(self.demo), str(self.ideas or ""))

class Idea:
  def __init__(self, idea):
    self.idea = idea
  def plain(self):
    return re.match(r'^\d\.(.*)', self.idea).groups()[0].strip()
  def __repr__(self):
    return self.idea

#globals

assignment = None
assignlist = list()

def parse_and_write():
  p = re.compile(r'\[(.*?)\]')
  reader = csv.reader(open("ideas.csv", "rb"))
  for row in reader:
      if row[5] == 'Approved':
        answer = row[8]
        cur = Assignment()
        cur.id = row[4]
        previousline = ""
        for i,line in enumerate(answer.split('\n')):
          line = line.strip()
          # answer to a survey question
          if '[' in line:
            line = line.lower()
            which_question = re.match(r'([^:]*)', previousline).groups()[0]
            for n, brackets in enumerate(p.findall(line)):
              if 'x' in brackets or '*' in brackets:
                if which_question in cur.demo:
                  cur.demo[which_question].append(n)
                else:
                  cur.demo[which_question] = list()
                  cur.demo[which_question].append(n)
          #starts with number.
          elif re.match(r'^\d\.', line):
            idea = Idea(line.strip())
            cur.ideas.append(idea)
          else:
            pass
            # print line
          if(":" in line): previousline = line
        assignlist.append(cur)
  prompt_string = "How can we conserve energy in the home?"
  cursor.execute("""insert into storm_postit(author_id, content) values (1,?)""", (prompt_string,))
  conn.commit()
  cursor.execute("""SELECT LAST_INSERT_ROWID() LIMIT 1;""")
  root_post_id = cursor.fetchone()[0]
  cursor.execute ("""insert into storm_board(prompt,author_id,root_postit_id, visits, responses, active) values (?,1,?,0,0,1)""", (prompt_string,root_post_id))
  conn.commit()
  cursor.execute("""SELECT LAST_INSERT_ROWID() LIMIT 1;""")
  board_id = cursor.fetchone()[0]
  print "BOARD INSERTED:"+str(board_id)
  cursor.execute("""UPDATE storm_postit SET board_id = ? where id = ? """, (board_id, root_post_id))
  print "UPDATED %s to %s" % (root_post_id, board_id)
  print conn.commit()
  for assignment in assignlist:
    # print assignment
    for idea in assignment.ideas:
        random_parent = math.floor(random.random()*186)
	if random_parent > 110: random_parent = "-1" 
	random_parent = 1
        cursor.execute ("""
            INSERT INTO storm_postit(author_id, parent_id, board_id, content) values(0,?,?,?)""", (random_parent, board_id, MySQLdb.escape_string(str(idea.plain()))))
        # print cursor
        conn.commit()
    # for demo in assignment.demo:
      
      # print assignment.id, demo, '\t', assignment.demo[demo]
      # pass

  # find_motivations()
  # find_word_frequencies()
      
def find_motivations():
  motivations = {'0':0, '1':0,'2':0,'3':0,'4':0}
  motivations_key = {'0':'Money', '1':'Boredom', '2': 'Distraction', '3':'Contributing to Projects', '4':'Other'}

  design_exp = {'0':0, '1':0,'2':0}
  design_exp_key = {'0':'None', '1':'Some', '2': 'Very'}
  
  total_count = 0
  for assignment in assignlist:
    for demo in assignment.demo:
      if demo == 'Experience with design':
        design_exp[str(assignment.demo[demo][0])] += 1
      if demo == "Motivation for participating in mTurk":
        has_given_answer = False
        for motiv in assignment.demo[demo]:
          if not has_given_answer: total_count += 1
          motivations[str(motiv)] += 1
          has_given_answer = True
  print total_count, " gave motivations"
  for motivation in motivations:
    freq = motivations[motivation]
    print motivations_key[motivation], " = ",  freq, ", ", freq/float(total_count)*100
  for exp in design_exp:
    freq = design_exp[exp]
    print design_exp_key[exp], " = ",  freq, ", ", freq/float(total_count)*100    
    

def find_word_frequencies():

  overallterms = dict()  
  counter = 0
  outputfile = file('plain_ideas.txt', 'w')
  for assignment in assignlist:
    for idea in assignment.ideas:
      words = re.findall(r'(\w+)', idea.plain().lower())
      for word in words:
        word = word.strip()
        if word not in stop_words:
          if word in overallterms:
            overallterms[word] += 1
          else:
            overallterms[word] = 1 
    # write it out
    outputfile.write('%s\t%s' % (counter, idea.plain()))
    outputfile.write('\n')
    counter = counter+1

  word_freq_file = file('word_freq.txt', 'w')
  threshold = 6
  for term,value in overallterms.items():
    if value > threshold:
      word_freq_file.write('%s|%s' % (term, value))
      word_freq_file.write('\n')
      word_freq_file.flush()
    # print term, '\t', value
    # pass

if __name__ == '__main__':
    # pass
    parse_and_write()
    cursor.close ()
    conn.close ()


  # find_word_frequencies()
        
        
