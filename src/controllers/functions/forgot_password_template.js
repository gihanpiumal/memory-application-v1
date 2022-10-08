module.exports = function getPasswordTemplate(fullName, link) {
    return (
      `
      <!DOCTYPE html>
  <html>
  <head>
      <title></title>
      <meta charset="utf-8" />
      <style type="text/css">
          .outer_table {
              border-bottom: #009490 solid 1px;
              border-left: #020202 solid 1px;
              border-right: #b354ba solid 1px;
          }
  
          .outer_table_td {
              background-color: #009490;
              height: 40px;
              font-family: Tahoma;
              font-size: 14px;
              font-size-adjust: none;
              font-weight: bold;
          }
  
          .txt_normal {
              font-family: Tahoma;
              font-size: 11px;
              font-size-adjust: none;
              color: #020202;
              height: 18px;
          }
  
          .inner_table_td_green {
              background-color: #cffffe;
              font-family: Tahoma;
              font-size: 11px;
              color: #000000;
              height: 22px;
              text-indent: 5px;
          }
  
          .inner_table_td_blue {
              
              background-color: #eeffff;
              font-family: Tahoma;
              font-size: 11px;
              color: #045d86;
              height: 22px;
              text-indent: 10px;
          }
      </style>
  
  </head>
  <body>
      <table border="0" cellspacing="0" cellpadding="0" class="outer_table">
          <tbody>
              <tr>
                  <td class="outer_table_td" style="        background-color: #020202" width="5">&nbsp;</td>
                  <td align="left" valign="middle" class="outer_table_td" style="padding-left:10px">
                      Reset Your Password Here
                  </td>
                  <td class="outer_table_td" width="5">&nbsp;</td>
              </tr>
              <tr>
                  <td colspan="3">&nbsp;</td>
              </tr>
              <tr>
                  <td>&nbsp;</td>
                  <td align="left" valign="top" style="padding-left:10px; padding-right:10px">
                      <table width="100%" border="0" cellspacing="2" cellpadding="2">
                          <tbody>
                              <tr>
                                  <td class="txt_normal">
                                      Dear&nbsp;` +
      fullName +
      `,<br>
                                      <br>
                                  </td>
                              </tr>
                              <tr>
                                  <td class="txt_normal">
                                      We heard you need a password reset. Click on the link below and you will redirected to a secure site from which you can set a new password.
                                      <br>
                                      <br>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <table width="100%" border="0" cellspacing="2" cellpadding="2">
                          <tbody>
                              <tr>
                                  <td colspan="2" class="txt_normal" style="padding-bottom:8px"><strong>Login Details</strong></td>
                              </tr>
                              <tr>
                                  <td class="inner_table_td_green" align="center">URL</td>
                                  <td class="inner_table_td_blue" align="center"><a href="` +
      link +
      `">` +
      link +
      `</a></td>
                              </tr>
                              <!--<tr>
                                  <td class="inner_table_td_green">User Name</td>
                                  <td class="inner_table_td_blue">{{UserName}}</td>
                              </tr>
                              <tr>
                                  <td class="inner_table_td_green">Password</td>
                                  <td class="inner_table_td_blue">{{Password}} <span>&nbsp;(It is advised to change the password at the first login)</span> </td>
                              </tr>-->
                          </tbody>
                      </table>
                      <table width="100%" border="0" cellspacing="2" cellpadding="2">
                          <tbody>
                              <tr>
                                  <td>&nbsp;</td>
                              </tr>
                              <tr>
                                  <td class="txt_normal">
                                      This is an auto generated email. Please do not reply to this email.
                                  </td>
                              </tr>
                              <tr>
                                  <td class="txt_normal">
                                      Regards,<br>
                                      IGRS
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                  </td>
                  <td align="left" valign="top">&nbsp;</td>
              </tr>
              <tr>
                  <td colspan="3">&nbsp;</td>
              </tr>
          </tbody>
      </table>
  </body>
  </html>
      `
    );
  };
  