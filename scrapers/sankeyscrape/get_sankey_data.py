#!/usr/bin/env python
# coding: utf-8

# In[1]:


from bs4 import BeautifulSoup
import requests
import time
import pandas as pd


# In[2]:


def get_moviedata(movie_links):  
    
#initialize empty concat_table
    concat_table = pd.DataFrame({"source":[],"value":[],"target":[]})

#loop through selected movie links
    for url in movie_links:
        if "elizabeth" in url and "elizabethtown" not in url:#fixes an annoying encoding error in an inelagent way
            url="https://www.boxofficemojo.com/movies/?page=intl&id=elizabeth%A0.htm"
        if "simpleplan" in url:
            url="https://www.boxofficemojo.com/movies/?page=intl&id=simpleplan%A0.htm"

        current_url = url 

#try again in 60s when the website is experiencing updating
        try:
            try:
                res = requests.get(current_url)
                soup = BeautifulSoup(res.content,"lxml")
                tables = pd.read_html(current_url)
            except:
                print("httperror")
                print(current_url)
                time.sleep(60)
                res = requests.get(current_url)

#use beautiful soup to get title, pd.read_html to get all other data
                soup = BeautifulSoup(res.content,"lxml")
                tables = pd.read_html(current_url)

#initialize title and domestic
            title = ""
            domestic = ""            

#title of the movie is always in the second <b> tag of the movie page, try again when error
            try:
                title = soup.find_all("b")[1].text
            except:
                print("title error")
                print(current_url)
                time.sleep(10)
                title = soup.find_all("b")[1].text

#domestic gross is always in the table[5] when reading all html tables, changing to str for the next if check
            table5 = tables[5]
            table5 = table5.astype(str)

#rule out the the possibility of lacking domestic gross
            if table5.iloc[0,1] == "nan":
                domestic = table5.iloc[0,0].split(": ")[1]

#fix a layout problem
            if "Domestic" in domestic:
                domestic = domestic.split("D")[0]

#create info_table for domestic gross links: usa -> movie title usa -> movie title
            info_table = pd.DataFrame([{"source":"USA",
                          "value":domestic,
                          "target":f"{title} Domestic"},
                           {"source":f"{title} Domestic",
                          "value":domestic,
                          "target":title}])
#get rid of unwanted text format
            info_table.value = info_table.value.str.replace("$","")
            info_table.value = info_table.value.str.replace(",","")
            info_table.value = info_table.value.str.replace("Estimate","")
            info_table.value = info_table.value.str.replace("(","")
            info_table.value = info_table.value.str.replace(")","")

#foreign gross is always in table[7] in the html tables if foreign gross exists
            foreign_table = tables[7]

#get only country names and total gross. If none, clear the table
            try:
                foreign_table = foreign_table[[0,5]].dropna(how="all").drop(0)
            except:
                foreign_table = foreign_table[[0]].dropna(how="all").drop(0)

#create foreign gross links: foreign country -> movie foreign total -> movie title
            foreign_table = foreign_table.rename(columns={0:"source",5:"value",2:"value"})
            foreign_table["target"] = ""
            foreign_table.iloc[0,2] = title
            foreign_table.iloc[1:,2] = f"{title} Foreign"
            foreign_table["source"] = foreign_table["source"].replace("FOREIGN TOTAL",f"{title} Foreign")
            foreign_table.value = foreign_table.value.str.replace("$","")
            foreign_table.value = foreign_table.value.str.replace(",","")
            foreign_table.value = foreign_table.value.str.replace("Estimate","")
            foreign_table.value = foreign_table.value.str.replace("(","")
            foreign_table.value = foreign_table.value.str.replace(")","")
            foreign_table = foreign_table[foreign_table.value.astype(str)!="nan"]
            foreign_table.value = foreign_table.value.astype(int)
            
#get the top 10 foreign countries in terms of gross contribution
            foreign_table = foreign_table.sort_values(by = "value",ascending=False).reset_index(drop=True).iloc[0:11,:]

#concatenate usa and foreign gross for one movie
            final_table = pd.concat([info_table, foreign_table],axis=0,sort=False)

#concatenate movie gross data while looping through the movie_links
            concat_table = pd.concat([concat_table,final_table])

        except:
            continue

#clear tables used
        table5 = table5.iloc[0:0]
        foreign_table = foreign_table.iloc[0:0]

    concat_table = concat_table.reset_index(drop=True)
    return concat_table    


# In[ ]:




